import { deleteCollectedArtwork } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { captureException } from "@sentry/react-native"
import { MyCollectionArtwork_sharedProps } from "__generated__/MyCollectionArtwork_sharedProps.graphql"
import { FormikProvider, useFormik } from "formik"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { cleanArtworkPayload, explicitlyClearedFields } from "lib/Scenes/MyCollection/utils/cleanArtworkPayload"
import { GlobalStore } from "lib/store/GlobalStore"
import React, { useRef, useState } from "react"
import { Alert } from "react-native"
import { useTracking } from "react-tracking"
import { myCollectionAddArtwork } from "../../mutations/myCollectionAddArtwork"
import { myCollectionDeleteArtwork } from "../../mutations/myCollectionDeleteArtwork"
import { myCollectionEditArtwork } from "../../mutations/myCollectionEditArtwork"
import { ArtworkFormValues } from "../../State/MyCollectionArtworkModel"
import { artworkSchema, validateArtworkSchema } from "./Form/artworkSchema"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { LoadingIndicator } from "lib/Components/LoadingIndicator"
import { isEqual } from "lodash"
import { deleteArtworkImage } from "../../mutations/deleteArtworkImage"
import { refreshMyCollection } from "../../MyCollection"
import { deletedPhotos } from "../../utils/deletedPhotos"
import { removeLocalPhotos, storeLocalPhotos, uploadPhotos } from "./MyCollectionImageUtil"
import { MyCollectionAdditionalDetailsForm } from "./Screens/MyCollectionArtworkFormAdditionalDetails"
import { MyCollectionAddPhotos } from "./Screens/MyCollectionArtworkFormAddPhotos"
import { MyCollectionArtworkFormMain } from "./Screens/MyCollectionArtworkFormMain"

export type ArtworkFormMode = "add" | "edit"

// This needs to be a `type` rather than an `interface` because there's
// a long-standing thing where a typescript `interface` will be treated a bit more strictly
// than the equivalent `type` in some situations.
// https://github.com/microsoft/TypeScript/issues/15300
// The react-navigation folks have written code that relies on the more permissive `type` behaviour.
// tslint:disable-next-line:interface-over-type-literal
export type ArtworkFormModalScreen = {
  ArtworkForm: {
    mode: ArtworkFormMode
    onDismiss(): void
    onDelete?(): void
  }
  AdditionalDetails: undefined
  AddPhotos: undefined
}

export type MyCollectionArtworkFormModalProps = { visible: boolean; onDismiss: () => void; onSuccess: () => void } & (
  | {
      mode: "add"
    }
  | {
      mode: "edit"
      onDelete: () => void
      artwork: Omit<MyCollectionArtwork_sharedProps, " $refType">
    }
)

export const MyCollectionArtworkFormModal: React.FC<MyCollectionArtworkFormModalProps> = (props) => {
  const { trackEvent } = useTracking()
  const { formValues, dirtyFormCheckValues } = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState
  )

  // we need to store the form values in a ref so that onDismiss can access their current value (prop updates are not
  // sent through the react-navigation system)
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues

  const [loading, setLoading] = useState<boolean>(false)

  const { showActionSheetWithOptions } = useActionSheet()

  const handleSubmit = async (values: ArtworkFormValues) => {
    setLoading(true)
    try {
      await updateArtwork(values, dirtyFormCheckValues, props)
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureException(e)
      }
      Alert.alert("An error ocurred", typeof e === "string" ? e : undefined)
    } finally {
      setLoading(false)
    }
  }

  const formik = useFormik<ArtworkFormValues>({
    enableReinitialize: true,
    initialValues: formValues,
    initialErrors: validateArtworkSchema(formValues),
    onSubmit: handleSubmit,
    validationSchema: artworkSchema,
  })

  const onDelete =
    props.mode === "edit" && props.onDelete
      ? async () => {
          setLoading(true)
          trackEvent(tracks.deleteCollectedArtwork(props.artwork.internalID, props.artwork.slug))
          try {
            await myCollectionDeleteArtwork(props.artwork.internalID)
            refreshMyCollection()
            props.onDelete()
          } catch (e) {
            if (__DEV__) {
              console.error(e)
            } else {
              captureException(e)
            }
            Alert.alert("An error ocurred", typeof e === "string" ? e : undefined)
          } finally {
            setLoading(false)
          }
        }
      : undefined

  const onDismiss = async () => {
    const formIsDirty = !isEqual(formValuesRef.current, dirtyFormCheckValues)

    if (formIsDirty) {
      const discardData = await new Promise((resolve) =>
        showActionSheetWithOptions(
          {
            title: "Do you want to discard your changes?",
            options: ["Discard", "Keep editing"],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
            useModal: true,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              resolve(true)
            }
          }
        )
      )
      if (!discardData) {
        return
      }
    }

    GlobalStore.actions.myCollection.artwork.resetForm()
    props.onDismiss?.()
  }

  return (
    <NavigationContainer independent>
      <FormikProvider value={formik}>
        <FancyModal visible={props.visible} onBackgroundPressed={onDismiss}>
          <Stack.Navigator
            // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
            detachInactiveScreens={false}
            screenOptions={{
              headerShown: false,
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen
              name="ArtworkForm"
              component={MyCollectionArtworkFormMain}
              initialParams={{ onDelete, onDismiss, mode: props.mode }}
            />
            <Stack.Screen name="AdditionalDetails" component={MyCollectionAdditionalDetailsForm} />
            <Stack.Screen name="AddPhotos" component={MyCollectionAddPhotos} />
          </Stack.Navigator>
          {!!loading && <LoadingIndicator />}
        </FancyModal>
      </FormikProvider>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<ArtworkFormModalScreen>()

export const updateArtwork = async (
  values: ArtworkFormValues,
  dirtyFormCheckValues: ArtworkFormValues,
  props: MyCollectionArtworkFormModalProps
) => {
  const { photos, artistSearchResult, pricePaidDollars, pricePaidCurrency, artist, artistIds, ...others } = values
  const externalImageUrls = await uploadPhotos(photos)

  let pricePaidCents
  if (pricePaidDollars && !isNaN(Number(pricePaidDollars))) {
    pricePaidCents = Number(pricePaidDollars) * 100
  }

  if (props.mode === "add") {
    const response = await myCollectionAddArtwork({
      artistIds: [artistSearchResult!.internalID as string],
      externalImageUrls,
      pricePaidCents,
      pricePaidCurrency,
      ...cleanArtworkPayload(others),
    })

    const slug = response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node?.slug
    if (slug) {
      storeLocalPhotos(slug, photos)
    }
  } else {
    const response = await myCollectionEditArtwork({
      artistIds: [artistSearchResult!.internalID as string],
      artworkId: props.artwork.internalID,
      externalImageUrls,
      pricePaidCents: pricePaidCents ?? null,
      pricePaidCurrency,
      ...cleanArtworkPayload(others),
      ...explicitlyClearedFields(others, dirtyFormCheckValues),
    })

    const deletedImages = deletedPhotos(dirtyFormCheckValues.photos, photos)
    for (const photo of deletedImages) {
      await deleteArtworkImage(props.artwork.internalID, photo.id)
    }
    const slug = response.myCollectionUpdateArtwork?.artworkOrError?.artwork?.slug
    const indices = deletedImages.map((image) => image.index)
    if (slug) {
      removeLocalPhotos(slug, indices)
    }
  }

  refreshMyCollection()
  props.onSuccess()
  setTimeout(() => {
    GlobalStore.actions.myCollection.artwork.resetForm()
  }, 500)
}

const tracks = {
  deleteCollectedArtwork: (internalID: string, slug: string) => {
    return deleteCollectedArtwork({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
