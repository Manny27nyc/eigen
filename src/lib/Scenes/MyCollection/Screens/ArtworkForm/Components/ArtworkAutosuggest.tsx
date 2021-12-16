import {
  ArtworkAutosuggestArtworkQuery,
  ArtworkAutosuggestArtworkQueryResponse,
} from "__generated__/ArtworkAutosuggestArtworkQuery.graphql"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import SearchIcon from "lib/Icons/SearchIcon"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { GlobalStore } from "lib/store/GlobalStore"
import { pickBy } from "lodash"
import { Box, Button, Flex, Input } from "palette"
import React, { useState } from "react"
import { fetchQuery, graphql } from "relay-runtime"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkAutosuggestResultsQueryRenderer } from "./ArtworkAutosuggestResults"

interface ArtworkAutosuggestProps {
  onResultPress(): void
}

export const ArtworkAutosuggest: React.FC<ArtworkAutosuggestProps> = ({ onResultPress }) => {
  const { formik } = useArtworkForm()
  const { artist: artistQuery, artistSearchResult } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const [_artwork, setArtwork] = useState<ArtworkGridItem_artwork | null>(null)
  const [artworkQuery, setArtworkQuery] = useState("")

  const artistSlug = artistSearchResult?.slug || ""

  const updateForm = async (artworkId: string) => {
    try {
      const artworkData = await fetchArtwork(artworkId)

      if (!artworkData) {
        return
      }

      // const formValues = {
      //   date: artworkData.date,
      //   depth: artworkData.depth,
      //   editionSize: artworkData.editionSize,
      //   editionNumber: artworkData.editionNumber,
      //   height: artworkData.height,
      //   isEdition: artworkData.isEdition,
      //   category: artworkData.medium,
      //   medium: artworkData.category,
      //   metric: artworkData.metric,
      //   title: artworkData.title,
      //   width: artworkData.width,
      // }

      const filteredFormValues = pickBy(artworkData, (value) => value !== null)

      console.log({ filteredFormValues })

      await GlobalStore.actions.myCollection.artwork.updateFormValues(filteredFormValues)

      onResultPress()
    } catch (error) {
      console.error("Couldn't load artwork data", error)
    }
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Input
        placeholder="Search artworks"
        icon={<SearchIcon width={18} height={18} />}
        onChangeText={(value) => {
          setArtworkQuery(value)
        }}
        onBlur={formik.handleBlur("artwork")}
        value={artworkQuery}
        enableClearButton
      />

      <Box height="100%">
        {artworkQuery.length >= 2 && (
          <Flex mb={2}>
            <ArtworkAutosuggestResultsQueryRenderer
              keyword={artworkQuery}
              artistSlug={artistSlug}
              onPress={(artworkResult) => {
                setArtwork(artworkResult)
                updateForm(artworkResult.internalID)
              }}
            />

            <Button variant="outline" onPress={undefined} mt={4}>
              Don't see your artwork? Skip ahead
            </Button>
          </Flex>
        )}
      </Box>
    </SearchContext.Provider>
  )
}

const fetchArtwork = async (artworkID: string): Promise<ArtworkAutosuggestArtworkQueryResponse["artwork"]> => {
  const result = await fetchQuery<ArtworkAutosuggestArtworkQuery>(
    defaultEnvironment,
    graphql`
      query ArtworkAutosuggestArtworkQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          medium: category
          date
          depth
          editionSize
          editionNumber
          height
          isEdition
          category: medium
          metric
          title
          width
        }
      }
    `,
    { artworkID }
  )

  return result.artwork
}
