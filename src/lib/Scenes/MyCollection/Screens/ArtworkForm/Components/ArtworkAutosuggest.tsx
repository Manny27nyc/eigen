import {
  ArtworkAutosuggestArtworkQuery,
  ArtworkAutosuggestArtworkQueryResponse,
} from "__generated__/ArtworkAutosuggestArtworkQuery.graphql"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import SearchIcon from "lib/Icons/SearchIcon"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { GlobalStore } from "lib/store/GlobalStore"
import { pickBy } from "lodash"
import { Box, Flex, Input } from "palette"
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

  const [loading, setLoading] = useState(false)

  const artistSlug = artistSearchResult?.slug || ""

  const updateForm = async (artworkId: string) => {
    setLoading(true)

    try {
      const artworkData = await fetchArtwork(artworkId)

      if (!artworkData) {
        return
      }

      const filteredFormValues = pickBy(artworkData, (value) => value !== null)

      await GlobalStore.actions.myCollection.artwork.updateFormValues(filteredFormValues)

      onResultPress()
    } catch (error) {
      console.error("Couldn't load artwork data", error)
    } finally {
      requestAnimationFrame(() => {
        setLoading(false)
      })
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
          </Flex>
        )}
      </Box>

      <LoadingModal isVisible={loading} />
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
