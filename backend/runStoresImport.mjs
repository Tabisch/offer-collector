import { importAldiNordStores } from "./stores/aldi-nord-stores.mjs";
import { importEdekaStores } from "./stores/edeka-stores.mjs";
import { importPennyStores } from "./stores/penny-stores.mjs";
import { importTrinkgutStores } from "./stores/trinkgut-stores.mjs";

export async function runStoresImport() {
    importAldiNordStores()
    importEdekaStores()
    importTrinkgutStores()
    importPennyStores()
}