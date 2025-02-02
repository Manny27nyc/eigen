/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistRail_rail = {
    readonly id: string;
    readonly key: string | null;
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly href: string | null;
        readonly name: string | null;
        readonly formattedNationalityAndBirthday: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
        readonly basedOn: {
            readonly name: string | null;
        } | null;
        readonly isFollowed: boolean | null;
    } | null> | null;
    readonly " $refType": "ArtistRail_rail";
};
export type ArtistRail_rail$data = ArtistRail_rail;
export type ArtistRail_rail$key = {
    readonly " $data"?: ArtistRail_rail$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtistRail_rail">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistRail_rail",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "key",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "results",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "href",
          "storageKey": null
        },
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "formattedNationalityAndBirthday",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "small"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"small\")"
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Artist",
          "kind": "LinkedField",
          "name": "basedOn",
          "plural": false,
          "selections": [
            (v1/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isFollowed",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HomePageArtistModule",
  "abstractKey": null
};
})();
(node as any).hash = 'f5752b0520bf79e5f014490bd91bc098';
export default node;
