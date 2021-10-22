import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NewWorksForYouRail_me } from "__generated__/NewWorksForYouRail_me.graphql"
import { NewWorksForYouRailQuery } from "__generated__/NewWorksForYouRailQuery.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { SmallTileRailPlaceholder } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Spinner, Theme } from "palette"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { SmallTileRailContainer } from "./SmallTileRail"
import { RailScrollProps } from "./types"

const PAGE_SIZE = 10
const MAX_ARTWORKS = 30

interface NewWorksForYouRailProps {
  me: NewWorksForYouRail_me
  relay: RelayPaginationProp
  onHide?: () => void
  onShow?: () => void
}

const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = ({
  me,
  relay,
  scrollRef,
  onHide,
  onShow,
}) => {
  const { trackEvent } = useTracking()

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const { hasMore, isLoading, loadMore } = relay
  // TODO: Add spinner when loading more data
  const [loadingMoreData, setLoadingMoreData] = useState(false)

  // This is to satisfy the TypeScript compiler based on Metaphysics types.
  const artworks = extractNodes(me?.newWorksByInterestingArtists)

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading() || artworks.length >= MAX_ARTWORKS) {
      return
    }

    setLoadingMoreData(true)

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error(error.message)
      }

      setLoadingMoreData(false)
    })
  }

  const hasArtworks = artworks.length

  useEffect(() => {
    hasArtworks ? onShow?.() : onHide?.()
  }, [hasArtworks])

  if (!hasArtworks) {
    return null
  }

  const navigateToNewWorksForYou = () => {
    trackEvent(tracks.tappedHeader())
    navigate(`/new-works-for-you`)
  }

  return (
    <Theme>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle title="New Works for You" onPress={navigateToNewWorksForYou} />
        </Flex>
        {
          <SmallTileRailContainer
            listRef={listRef}
            artworks={artworks as any}
            contextModule={ContextModule.newWorksForYouRail}
            onEndReached={loadMoreArtworks}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loadingMoreData ? (
                <Flex justifyContent="center" ml={3} mr={5} height="120">
                  <Spinner />
                </Flex>
              ) : undefined
            }
          />
        }
      </View>
    </Theme>
  )
}

const NewWorksForYouRailQueryDefinition = graphql`
  query NewWorksForYouRailQuery($cursor: String, $count: Int!) {
    me {
      ...NewWorksForYouRail_me @arguments(cursor: $cursor, count: $count)
    }
  }
`

export const NewWorksForYouRailContainer = createPaginationContainer(
  NewWorksForYouRail,
  {
    me: graphql`
      fragment NewWorksForYouRail_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        newWorksByInterestingArtists(first: $count, after: $cursor)
          @connection(key: "NewWorksForYouRail_newWorksByInterestingArtists") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              ...SmallTileRail_artworks
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.newWorksByInterestingArtists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: NewWorksForYouRailQueryDefinition,
  }
)

export const NewWorksForYouRailQueryRenderer: React.FC<{ environment: RelayModernEnvironment }> = ({ environment }) => {
  return (
    <QueryRenderer<NewWorksForYouRailQuery>
      environment={environment}
      /* tslint:disable relay-operation-generics */
      query={NewWorksForYouRailQueryDefinition}
      variables={{ count: 10 }}
      render={renderWithPlaceholder({
        Container: NewWorksForYouRailContainer,
        renderPlaceholder: () => <SmallTileRailPlaceholder />,
        renderFallback: () => null,
      })}
    />
  )
}

const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.newWorksForYou,
    type: "header",
  }),
}
