import { importAldiNordStores } from "./stores/aldi-nord-stores.mjs";
import { importEdekaStores } from "./stores/edeka-stores.mjs";
import { importKauflandStores } from "./stores/kaufland-stores.mjs";
import { importPennyStores } from "./stores/penny-stores.mjs";
import { importStroetmannStores } from "./stores/stroetmann-stores.mjs";
import { importTrinkgutStores } from "./stores/trinkgut-stores.mjs";
import { setLastFetched } from "./util/database.mjs";
import { allowedToFetch } from "./util/dates.mjs";

export async function runStoresImport() {
    const monitorName = "Stores"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    console.log(`Importing ${monitorName}`)

    importAldiNordStores()
    importEdekaStores()
    importTrinkgutStores()
    importPennyStores()
    importStroetmannStores()
    importKauflandStores()

    setLastFetched(monitorName, "Stores")
}