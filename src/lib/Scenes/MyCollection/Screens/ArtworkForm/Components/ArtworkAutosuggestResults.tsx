import { OwnerType } from "@artsy/cohesion"
import { ArtworkAutosuggestResults_viewer } from "__generated__/ArtworkAutosuggestResults_viewer.graphql"
import { ArtworkAutosuggestResultsContainerQuery } from "__generated__/ArtworkAutosuggestResultsContainerQuery.graphql"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import Artwork from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { GenericGridPlaceholder } from "lib/Components/ArtworkGrids/GenericGrid"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Flex } from "palette"
import React, { useEffect, useState } from "react"
import { QueryRenderer } from "react-relay"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export interface ArtworkAutosuggestResultsProps {
  viewer: ArtworkAutosuggestResults_viewer
  relay: RelayPaginationProp
  keyword: string
  onPress?: (artwork: ArtworkGridItem_artwork) => void
}

const ArtworkAutosuggestResults: React.FC<ArtworkAutosuggestResultsProps> = ({ viewer, relay, keyword, onPress }) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(relay.isLoading)
  }, [relay.isLoading])

  const artworksCount = viewer.artworks?.edges?.length

  return (
    <Box py={2}>
      {!!artworksCount && (
        <InfiniteScrollArtworksGridContainer
          connection={viewer.artworks!}
          loadMore={relay.loadMore}
          hasMore={relay.hasMore}
          updateRecentSearchesOnTap
          contextScreenOwnerType={OwnerType.search}
          contextScreenQuery={keyword}
          contextScreen={Schema.PageNames.Search}
          useParentAwareScrollView={false}
          ItemComponent={(props) => <Artwork {...props} hideSaleInfo hidePartner handleTap={onPress} />}
        />
      )}
      {!isLoading && (
        <Button variant="outline" onPress={undefined} mt={3}>
          Don't see your artwork? Skip ahead
        </Button>
      )}
    </Box>
  )
}

export const ArtworkAutosuggestResultsPaginationContainer = createPaginationContainer(
  ArtworkAutosuggestResults,
  {
    viewer: graphql`
      fragment ArtworkAutosuggestResults_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        keyword: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        artworks: artworksConnection(first: $count, after: $cursor, keyword: $keyword, input: $input)
          @connection(key: "ArtworkAutosuggestResults_artworks") {
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.artworks
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtworkAutosuggestResultsQuery(
        $count: Int!
        $cursor: String
        $keyword: String
        $input: FilterArtworksInput
      ) {
        viewer {
          ...ArtworkAutosuggestResults_viewer
            @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
        }
      }
    `,
  }
)

export const ArtworkAutosuggestResultsQueryRenderer: React.FC<{
  keyword: string
  artistSlug: string
  onPress?: (artwork: ArtworkGridItem_artwork) => void
}> = ({ keyword, artistSlug, onPress }) => {
  return (
    <QueryRenderer<ArtworkAutosuggestResultsContainerQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtworkAutosuggestResultsContainerQuery(
          $count: Int!
          $cursor: String
          $keyword: String
          $input: FilterArtworksInput
        ) {
          viewer {
            ...ArtworkAutosuggestResults_viewer
              @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ArtworkAutosuggestResultsPaginationContainer,
        renderPlaceholder: () => <ArtworkAutosuggestResultsPlaceholder />,
        initialProps: { keyword, artistSlug, onPress },
        renderFallback: ({ retry }) => <LoadFailureView onRetry={retry!} />,
      })}
      variables={{ count: 20, keyword, input: { artistIDs: [artistSlug] } }}
      cacheConfig={{ force: true }}
    />
  )
}

export const ArtworkAutosuggestResultsPlaceholder: React.FC = () => {
  const screen = useScreenDimensions()

  return (
    <Flex accessibilityLabel="Artwork results are loading" mt={2} mr={2}>
      <GenericGridPlaceholder width={screen.width - 40} />
    </Flex>
  )
}
