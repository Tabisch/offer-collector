import { importLidl } from "./monitors/lidl.mjs";
import { importStroetmann } from "./monitors/stroetmann.mjs";
import { importPenny } from "./monitors/penny.mjs";
import { importTrinkgut } from "./monitors/trinkgut.mjs";
import { importKaufland } from "./monitors/kaufland.mjs";
import { importAldiNord } from "./monitors/aldi-nord.mjs";
import { importEdeka } from "./monitors/edeka.mjs";
import { updateOfferCache } from "./util/database.mjs";
import Store from "./schemas/storeSchema.mjs";

export async function runMonitors() {
    await Store.find({
        selected: true,
        group: 'stroetmann'
    }).then((result => {
        result.forEach((storeData) => {
            importStroetmann()
        })
    }))

    await Store.find({
        selected: true,
        group: 'edeka'
    }).then((result => {
        result.forEach((storeData) => {
            importEdeka(storeData)
        })
    }))

    await Store.find({
        selected: true,
        group: 'penny'
    }).then((result => {
        result.forEach((storeData) => {
            importPenny(storeData)
        })
    }))

    await Store.find({
        selected: true,
        group: 'aldi-nord'
    }).then((result => {
        result.forEach((storeData) => {
            importAldiNord()
        })
    }))

    await Store.find({
        selected: true,
        group: 'trinkgut'
    }).then((result => {
        result.forEach((storeData) => {
            importTrinkgut(storeData)
        })
    }))

    await Store.find({
        selected: true,
        group: 'kaufland'
    }).then((result => {
        result.forEach((storeData) => {
            importKaufland()
        })
    }))

    // TODO make Lidl and Kaufland optional when stores implemented
    // await importLidl()

    updateOfferCache()
}

setInterval(runMonitors, (5 * 60 * 1000));