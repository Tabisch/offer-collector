import { json } from "express";
import { getWeek, pennyDate } from "../util/dates.mjs";

export async function importPenny() {

    const offSet = 24 * 60 * 60 * 1000
    const timeNow = new Date()
    const lastfetched = new Date((await (await fetch("http://localhost:3000/lastFetch?seller=penny")).json())["fetchTime"])

    if (timeNow - lastfetched < offSet) {
        console.log(`penny - abort Update`)
        return
    }

    const calendarWeek = getWeek(timeNow)
    const currentYear = timeNow.getFullYear()

    const fetched = (await (await fetch(`https://www.penny.de/.rest/offers/${currentYear}-${calendarWeek}`)).json())[0]

    let categoryDateRanges = {}

    console.log(timeNow)

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
                    try {
                        fetch("http://localhost:3000/insertData", {
                            method: "post",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                product: offer["title"],
                                price: Number(offer["price"].replace("*", "")),
                                seller: "penny",
                                startDateTime: categoryDateRanges[range]["startTime"],
                                endDateTime: categoryDateRanges[range]["endTime"]
                            })
                        })
                    } catch (error) {

                    }
                })
            }
        })
    })

    return
}