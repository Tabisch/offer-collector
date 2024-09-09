import { XMLParser } from "fast-xml-parser";
import { version } from "mongoose";
import { allowedToFetch } from "../util/dates.mjs";
import { insertOffer, setLastFetched } from "../util/database.mjs";

export async function importKaufland() {
    const monitorName = "kaufland"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    const fetchRaw = await (await fetch("https://filiale.kaufland.de/angebote/uebersicht.html",
        {
            headers: {
                'Cookie': 'x-aem-variant=DE1300;',
            }
        },)).text()

    const options = {
        ignoreAttributes: false,
        // preserveOrder: true,
        unpairedTags: ["hr", "br", "link", "meta"],
        stopNodes: ["*.pre", "*.script"],
        processEntities: true,
        htmlEntities: true
    };

    const parser = new XMLParser(options);
    let jObj = await parser.parse(fetchRaw);

    let offersUnstructured = await traverseTree(jObj)

    let currenWeekDates = offersUnstructured["props"]["weekData"]["currentWeekDates"]
    
    let offersStructured = await traverseOffersTree(offersUnstructured)

    const regex = /\d\d\d\d-\d\d-\d\d/gm;

    offersStructured.forEach(async (offer) => {

        if(offer["price"] === 0) {
            return
        }

        if(offer["title"] === "KROMBACHER"){
            console.log("KROMBACHER")
        }

        let website = ""

        if(currenWeekDates.includes(offer["dateTo"])) {
            website = `https://filiale.kaufland.de/angebote/uebersicht.html?kloffer-category=${offer["kloffer-category"]}&kloffer-articleID=${offer["klNr"]}`
        }
        else {
            website = `https://filiale.kaufland.de/angebote/uebersicht.html?kloffer-category=${offer["kloffer-category"]}&kloffer-articleID=${offer["klNr"]}&kloffer-week=next`
        }

        insertOffer({
            product: `${offer["title"]} ${offer["subtitle"]}`,
            price: offer["price"],
            seller: "kaufland",
            startDateTime: Date.parse(offer["dateFrom"]),
            endDateTime: Date.parse(offer["dateTo"]),
            website: website
        })
    })

    setLastFetched(monitorName)
}

function traverseTree(tree) {
    const list = []

    traverseTreeRecurse(tree, list)

    return JSON.parse(list[0]["script"][1].slice(84))
}

function traverseTreeRecurse(tree, offerList) {
    if (Array.isArray(tree)) {
        tree.forEach((item) => {
            traverseTreeRecurse(item, offerList)
        })

        return
    }

    if (typeof (tree) === "object") {
        if (Object.keys(tree).includes("@_class")) {
            if (tree["@_class"].includes("page__content")) {
                offerList.push(tree)
                return
            }
        }

        Object.keys(tree).forEach((key) => {
            traverseTreeRecurse(tree[key], offerList)
        })
    }
}

function traverseOffersTree(tree) {
    const list = []

    traverseOffersTreeRecurse(tree, list)

    return list
}

function traverseOffersTreeRecurse(tree, offerList) {
    if (Array.isArray(tree)) {
        tree.forEach((item) => {
            traverseOffersTreeRecurse(item, offerList)
        })

        return
    }

    if (typeof (tree) === "object") {
        if (Object.keys(tree).includes("offerCategoryId")) {
            tree["offers"].forEach(element => {
                element["kloffer-category"] = tree["name"]
                offerList.push(element)
                return
            });
        }

        Object.keys(tree).forEach((key) => {
            traverseOffersTreeRecurse(tree[key], offerList)
        })
    }
}