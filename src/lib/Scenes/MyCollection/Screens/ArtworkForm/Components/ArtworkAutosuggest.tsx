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
import { Box, Button, Flex, Input, Spacer, Text } from "palette"
import React, { useState } from "react"
import { fetchQuery, graphql } from "relay-runtime"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkAutosuggestResultsQueryRenderer } from "./ArtworkAutosuggestResults"

export const ArtworkAutosuggest: React.FC = () => {
  const { formik } = useArtworkForm()
  const { artist: artistQuery, artistSearchResult } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const [artwork, setArtwork] = useState<ArtworkGridItem_artwork | null>(null)
  const [artworkQuery, setArtworkQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const artistSlug = artistSearchResult?.slug || ""

  const showArtworkAutosuggestResults = isFocused && artistSlug && artworkQuery.length > 0

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

      GlobalStore.actions.myCollection.artwork.updateFormValues(filteredFormValues)
    } catch (error) {
      console.error("Couldn't load artwork data", error)
    }
  }

  return (
    <>
      {!!artwork ? (
        <>
          <Text variant="xs">ARTWORK</Text>
          <Spacer mt={0.5} />
          <Flex flexDirection="row" alignItems="center">
            <Text>{artwork?.title}</Text>
            <Spacer ml="1" />
            <Flex flex={1}>
              <Button
                variant="fillGray"
                size="small"
                onPress={() => {
                  setArtwork(null)
                }}
              >
                Remove
              </Button>
            </Flex>
          </Flex>
        </>
      ) : (
        <SearchContext.Provider value={searchProviderValues}>
          <Box>
            <Input
              title="ARTWORK"
              placeholder="Search artworks"
              icon={<SearchIcon width={18} height={18} />}
              onChangeText={(value) => {
                setIsFocused(true)
                setArtworkQuery(value)
              }}
              onBlur={formik.handleBlur("artwork")}
              onFocus={() => setIsFocused(true)}
              value={artworkQuery}
              enableClearButton
            />

            {!!showArtworkAutosuggestResults && (
              <Box height="100%">
                <ArtworkAutosuggestResultsQueryRenderer
                  keyword={artworkQuery}
                  artistSlug={artistSlug}
                  onPress={(artworkResult) => {
                    setArtwork(artworkResult)
                    updateForm(artworkResult.internalID)
                    setIsFocused(false)
                  }}
                />
              </Box>
            )}
          </Box>
        </SearchContext.Provider>
      )}
    </>
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
