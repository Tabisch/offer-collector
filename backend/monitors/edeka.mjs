import Store from "../schemas/storeSchema.mjs"
import { insertOffer, setLastFetched } from "../util/database.mjs"
import { allowedToFetch } from "../util/dates.mjs"

export async function importEdeka() {
    const monitorName = "edeka"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    let offers = await (await fetch("https://www.edeka.de/api/offers?marketId=12541")).json()
    //let storesPagesCount = Math.ceil(((await (await fetch("https://www.edeka.de/api/marketsearch/markets")).json())["totalCount"] / 999))

    //Array.from(Array(storesPagesCount).keys()).forEach(async (number) => {
//
    //    let result = await (await fetch(`https://www.edeka.de/api/marketsearch/markets?size=999&page=${number}`)).json()
//
    //    result["markets"].forEach(async (store) => {
    //        const options = {
    //            upsert: true,
    //            new: true,
    //            setDefaultsOnInsert: true
    //        }
//
    //        const filterOffer = {
    //            name: store["name"],
    //            group: "edeka",
    //            targetApiIdentifier: store["id"]
    //        }
//
    //        const st = await Store.findOneAndUpdate(filterOffer, filterOffer, options)
//
    //        try {
    //            await st.save()
    //        } catch (error) {
    //            console.log(`error import: ${store["name"]} - edeka - ${store["id"]}`)
    //            res.sendStatus(400)
    //            return
    //        }
    //    })
    //})

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