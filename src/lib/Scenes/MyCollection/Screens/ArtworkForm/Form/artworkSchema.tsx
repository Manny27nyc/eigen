import { yupToFormErrors } from "formik"
import { ArtworkFormValues } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import * as Yup from "yup"

export const artworkSchema = Yup.object().shape({
  artistSearchResult: Yup.object()
    .nullable()
    .test("artistSearchResult", "Artist search result required", (value) => value !== null),
  medium: Yup.string().test("medium", "Medium required", (value) => value !== ""),
  photos: Yup.array().test("photos", "Photos required", (value) => {
    // Allow us to bypass adding photos in DEV
    if (__DEV__) {
      return true
    }

    if (value === null || value === undefined) {
      return false
    }

    return value.length > 0
  }),
  title: Yup.string().test("title", "Title is required", (value) => value !== ""),
})

export function validateArtworkSchema(values: ArtworkFormValues) {
  let errors = {}
  try {
    artworkSchema.validateSync(values, {
      abortEarly: false,
    })
  } catch (error) {
    errors = yupToFormErrors(error)
  }
  return errors
}
