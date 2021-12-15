/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash bb435f5c83b94d4d31e213a9ec0e20d9 */

import { ConcreteRequest } from "relay-runtime";
export type ArtworkAutosuggestArtworkQueryVariables = {
    artworkID: string;
};
export type ArtworkAutosuggestArtworkQueryResponse = {
    readonly artwork: {
        readonly medium: string | null;
        readonly date: string | null;
        readonly depth: string | null;
        readonly editionSize: string | null;
        readonly editionNumber: string | null;
        readonly height: string | null;
        readonly isEdition: boolean | null;
        readonly category: string | null;
        readonly metric: string | null;
        readonly title: string | null;
        readonly width: string | null;
    } | null;
};
export type ArtworkAutosuggestArtworkQuery = {
    readonly response: ArtworkAutosuggestArtworkQueryResponse;
    readonly variables: ArtworkAutosuggestArtworkQueryVariables;
};



/*
query ArtworkAutosuggestArtworkQuery(
  $artworkID: String!
) {
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
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "alias": "medium",
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "depth",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionSize",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionNumber",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isEdition",
  "storageKey": null
},
v9 = {
  "alias": "category",
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "metric",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkAutosuggestArtworkQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtworkAutosuggestArtworkQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "bb435f5c83b94d4d31e213a9ec0e20d9",
    "metadata": {},
    "name": "ArtworkAutosuggestArtworkQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '657c70e8f2ac482febc3dcfe1df4f988';
export default node;
