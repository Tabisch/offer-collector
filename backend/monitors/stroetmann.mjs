import { json } from "express";
import { allowedToFetch } from "../util/dates.mjs";
import { insertOffer, setLastFetched } from "../util/database.mjs";

export async function importStroetmann() {
    const monitorName = "stroetmann"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    const collections = await (await fetch("https://katalog.stroetmann.de/api/collections/me")).json()

    collections.forEach(async (collection) => {
        const offers = (await (await fetch(`https://katalog.stroetmann.de/api/collections/${collection['_id']}`)).json())["slots"]

        offers.forEach(async (offer) => {
            const product = `${offer['articles'][0]['text'][0]} ${offer['articles'][0]['text'][1]}`

            insertOffer({
                product: `${product}`,
                seller: "stroetmann",
                price: `${offer["articles"][0]["brutto"]}`,
                startDateTime: `${collection["from"]}`,
                endDateTime: `${collection["until"]}`
            })
        })
    });

    setLastFetched(monitorName)
}