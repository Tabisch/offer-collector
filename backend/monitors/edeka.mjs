import Store from "../schemas/storeSchema.mjs"
import { insertOffer, setLastFetched } from "../util/database.mjs"
import { allowedToFetch } from "../util/dates.mjs"

export async function importEdeka(storeData) {
    const monitorName = `${storeData.group} - ${storeData.targetApiIdentifier}`

    if (!await allowedToFetch(monitorName)) {
        return
    }

    console.log(`Importing ${monitorName}`)

    let offers;

    try {
        offers = await (await fetch(`https://www.edeka.de/api/offers?marketId=${storeData.targetApiIdentifier}`)).json()
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
            seller: storeData.name,
            startDateTime: startDateTime,
            endDateTime: endDateTime
        })
    });

    setLastFetched(monitorName)
}