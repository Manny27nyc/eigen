import SearchIcon from "lib/Icons/SearchIcon"
import { AutosuggestResults } from "lib/Scenes/Search/AutosuggestResults"
import { OnResultPress } from "lib/Scenes/Search/components/AutosuggestSearchResult"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { GlobalStore } from "lib/store/GlobalStore"
import { Box, Input } from "palette"
import React from "react"
import { useArtworkForm } from "../Form/useArtworkForm"

interface ArtistAutosuggestProps {
  onResultPress(): void
}
export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({ onResultPress }) => {
  const { formik } = useArtworkForm()
  const { artist: artistQuery } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const handleResultPress: OnResultPress = async (result) => {
    await GlobalStore.actions.myCollection.artwork.setArtistSearchResult(result)
    onResultPress()
  }
  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Box>
        <Input
          placeholder="Search for Artists on Artsy"
          icon={<SearchIcon width={18} height={18} />}
          onChangeText={formik.handleChange("artist")}
          onBlur={formik.handleBlur("artist")}
          value={formik.values.artist}
          enableClearButton
        />

        {artistQuery.length > 2 ? (
          <Box height="100%">
            <AutosuggestResults
              query={artistQuery}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={handleResultPress}
            />
          </Box>
        ) : null}
      </Box>
    </SearchContext.Provider>
  )
}
