/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type Registration_me = {
    readonly has_credit_cards: boolean | null;
    readonly " $refType": "Registration_me";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Registration_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "has_credit_cards",
      "name": "hasCreditCards",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '2ea235b47d0e263d35015619a60e1b14';
export default node;
