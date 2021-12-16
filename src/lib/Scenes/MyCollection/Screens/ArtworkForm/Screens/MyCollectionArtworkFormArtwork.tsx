import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArtistSearchResult } from "../Components/ArtistSearchResult"
import { ArtworkAutosuggest } from "../Components/ArtworkAutosuggest"
import { useArtworkForm } from "../Form/useArtworkForm"

import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionArtworkFormArtwork: React.FC<StackScreenProps<ArtworkFormScreen, "ArtworkFormArtwork">> = ({
  route,
  navigation,
}) => {
  const { formik } = useArtworkForm()

  const handleNext = () => navigation.navigate("ArtworkFormMain", { ...route.params })

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={route.params.onHeaderBackButtonPress}
        rightButtonText="Skip"
        onRightButtonPress={handleNext}
        hideBottomDivider
      >
        Select an Artwork
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <ScreenMargin>
          {!!formik.values.artistSearchResult && <ArtistSearchResult result={formik.values.artistSearchResult} />}
          <Spacer mb={2} />
          <ArtworkAutosuggest onResultPress={handleNext} />
        </ScreenMargin>
      </ScrollView>
    </>
  )
}
