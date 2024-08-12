import { json } from "express";

export async function importStroetmann() {

    const collections = await (await fetch("https://katalog.stroetmann.de/api/collections/me")).json()

    collections.forEach(async (collection) => {
        const offers = (await (await fetch(`https://katalog.stroetmann.de/api/collections/${collection['_id']}`)).json())["slots"]

        offers.forEach(async (offer) => {
            const product = `${offer['articles'][0]['text'][0]} ${offer['articles'][0]['text'][1]}`

            await fetch("http://localhost:3000/insertData", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    product: `${product}`,
                    seller: "stroetmann",
                    price: `${offer["articles"][0]["brutto"]}`,
                    startDateTime: `${collection["from"]}`,
                    endDateTime: `${collection["until"]}`
                })
            })
        })
    });
}