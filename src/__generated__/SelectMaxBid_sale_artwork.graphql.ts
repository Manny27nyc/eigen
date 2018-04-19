/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SelectMaxBid_sale_artwork = {
    readonly bid_increments: ReadonlyArray<number | null> | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_sale_artwork",
  "type": "SaleArtwork",
  "metadata": {},
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "bid_increments",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '9b5cd077ad96f8c8349b1e1a060733ca';
export default node;
