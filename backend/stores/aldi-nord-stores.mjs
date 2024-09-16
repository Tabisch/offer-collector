import { insertStore } from "../util/database.mjs"

export async function importAldiNordStores() {
    const storesUpdater = "aldi-nord"

    const stores = await (await fetch("https://locator.uberall.com/api/storefinders/ALDINORDDE_UimhY3MWJaxhjK9QdZo3Qa4chq1MAu/locations/all?v=20230110&language=de&fieldMask=id&fieldMask=identifier&fieldMask=googlePlaceId&fieldMask=lat&fieldMask=lng&fieldMask=name&fieldMask=country&fieldMask=city&fieldMask=province&fieldMask=streetAndNumber&fieldMask=zip&fieldMask=businessId&fieldMask=addressExtra&")).json()

    stores["response"]["locations"].forEach((store) => {
        insertStore({
            name: store["name"],
            zipCode: store["zip"],
            city: store["city"],
            street: store["streetAndNumber"],
            group: "aldi-nord",
            longitude: store["lng"],
            latitude: store["lat"],
            targetApiIdentifier: store["id"],
            data: store,
            //website: store["detailURL"]
        })
    })
}