import { json } from "express";
import { allowedToFetch, getWeek, pennyDate } from "../util/dates.mjs";
import { insertOffer, setLastFetched } from "../util/database.mjs";

export async function importPenny() {
    const monitorName = "penny"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    const timeNow = new Date()

    const calendarWeek = getWeek(timeNow)
    const currentYear = timeNow.getFullYear()

    const fetched = (await (await fetch(`https://www.penny.de/.rest/offers/${currentYear}-${calendarWeek}`)).json())[0]

    let categoryDateRanges = {}

    Object.keys(fetched["categoriesMenuPeriod"]).forEach((categoriesMenuPeriodKey) => {
        categoryDateRanges[fetched["categoriesMenuPeriod"][categoriesMenuPeriodKey]["slug"]] = {
            "startTime": pennyDate(timeNow, fetched["categoriesMenuPeriod"][categoriesMenuPeriodKey]["startDayIndex"]),
            "endTime": pennyDate(timeNow, fetched["categoriesMenuPeriod"][categoriesMenuPeriodKey]["endDayIndex"])
        }
    })

    fetched["categories"].forEach((category) => {
        Object.keys(categoryDateRanges).forEach((range) => {
            if (category["id"].includes(range)) {
                category["offerTiles"].forEach((offer) => {

                    if(!Object.keys(offer).includes("price")) {
                        return
                    }

                    let price = offer["price"].replace("*", "").replace("je ", "").replace("–", "0")

                    if(Number.isNaN(price)) {
                        console.log("NaN")
                        return
                    }

                    insertOffer({
                        product: offer["title"],
                        price: price,
                        seller: "penny",
                        startDateTime: categoryDateRanges[range]["startTime"],
                        endDateTime: categoryDateRanges[range]["endTime"]
                    })
                })
            }
        })
    })

    setLastFetched(monitorName)
}