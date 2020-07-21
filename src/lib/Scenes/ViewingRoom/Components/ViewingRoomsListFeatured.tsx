import { color, Flex, MediumCard, Spacer } from "@artsy/palette"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RailScrollProps } from "lib/Scenes/Home/Components/types"
import { extractNodes } from "lib/utils/extractNodes"
import _ from "lodash"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, TouchableHighlight, View } from "react-native"
import { graphql, useFragment } from "relay-hooks"
import { tagForStatus } from "./ViewingRoomsListItem"

export const featuredFragment = graphql`
  fragment ViewingRoomsListFeatured_featured on ViewingRoomConnection {
    edges {
      node {
        internalID
        title
        slug
        heroImageURL
        status
        distanceToOpen(short: true)
        distanceToClose(short: true)
        partner {
          name
        }
      }
    }
  }
`

interface FeaturedRailProps {
  featured: ViewingRoomsListFeatured_featured$key
}

export const FeaturedRail: React.FC<FeaturedRailProps & RailScrollProps> = ({ scrollRef, ...props }) => {
  const featuredData = useFragment(featuredFragment, props.featured)
  const featured = extractNodes(featuredData)
  const navRef = useRef(null)
  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0 }),
  }))

  return (
    <View ref={navRef}>
      <AboveTheFoldFlatList
        ListHeaderComponent={() => <Spacer ml="2" />}
        ListFooterComponent={() => <Spacer ml="2" />}
        horizontal
        listRef={listRef}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={2}
        keyExtractor={item => item.internalID}
        data={featured}
        ItemSeparatorComponent={() => <Spacer ml={15} />}
        renderItem={({ item }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <TouchableHighlight
              onPress={() =>
                void SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${item.slug!}`)
              }
              underlayColor={color("white100")}
              activeOpacity={0.8}
            >
              <Flex width={280} height={372}>
                <MediumCard title={item.title} subtitle={item.partner!.name!} image={item.heroImageURL!} tag={tag} />
              </Flex>
            </TouchableHighlight>
          )
        }}
      />
    </View>
  )
}
