import Store from "../schemas/storeSchema.mjs"
import { insertOffer, setLastFetched } from "../util/database.mjs"
import { allowedToFetch } from "../util/dates.mjs"

export async function importEdeka() {
    const monitorName = "edeka"

    if (!await allowedToFetch(monitorName)) {
        return
    }

    let offers;

    try {
        offers = await (await fetch("https://www.edeka.de/api/offers?marketId=12541")).json()
    } catch (error) {
        console.log(`${monitorName} - fetch failed - skipped`)
        return
    }

    let startDateTime = new Date(offers["validFrom"])
    let endDateTime = new Date(offers["validTill"])

    offers["offers"].forEach(offer => {
        insertOffer({
            product: offer["title"],
            price: offer["price"]["rawValue"],
            seller: "edeka",
            startDateTime: startDateTime,
            endDateTime: endDateTime
        })
    });

    setLastFetched(monitorName)
}