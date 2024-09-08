import { json } from "express";
import { allowedToFetch, getWeek, pennyDate } from "../util/dates.mjs";
import { insertOffer, setLastFetched } from "../util/database.mjs";

export async function importPenny() {
    const monitorName = "penny"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    const timeNow = new Date()

    let calendarWeek = getWeek(timeNow)

    if(timeNow.getDay() === 0) {
        calendarWeek = calendarWeek + 1
    }

    const currentYear = timeNow.getFullYear()

    // console.log(`${calendarWeek} - ${currentYear}`)
    // console.log(`https://www.penny.de/.rest/offers/${currentYear}-${calendarWeek}`)

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

                    if(offer["price"] === null) {
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