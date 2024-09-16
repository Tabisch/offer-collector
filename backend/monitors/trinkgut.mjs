import { XMLParser } from "fast-xml-parser";
import { insertOffer, setLastFetched } from "../util/database.mjs";
import { allowedToFetch } from "../util/dates.mjs";

export async function importTrinkgut() {
    const monitorName = "trinkgut"

    if (!await allowedToFetch(monitorName)) {
        return
    }

    const fetchRaw = await (await fetch("https://www.trinkgut.de/angebote/?market=722d7aab-9951-4d80-a52c-684479bf14c0")).text()

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

    let offers = await traverseTree(jObj)

    let dateRangesFromText = await offers.shift()

    const regex = /Gültig vom (\d\d\.\d\d\.\d\d\d\d) bis (\d\d\.\d\d\.\d\d\d\d)\s+\|\s+Nur solange der Vorrat reicht\./

    let regexResult = await regex.exec(dateRangesFromText)

    let startDateSplit = regexResult[1].split(".")
    let endDateSplit = regexResult[2].split(".")

    let startDate = new Date(startDateSplit[2], startDateSplit[1] - 1, startDateSplit[0])
    let endDate = new Date(endDateSplit[2], endDateSplit[1] - 1, endDateSplit[0])

    offers.forEach(async (offer) => {
        const fetchOfferRaw = await (await fetch(offer)).text()

        const optionsOffer = {
            ignoreAttributes: false,
            // preserveOrder: true,
            unpairedTags: ["hr", "br", "link", "meta"],
            stopNodes: ["*.pre", "*.script"],
            processEntities: true,
            htmlEntities: true
        };

        const parserPage = new XMLParser(optionsOffer);
        let offerPage = await parserPage.parse(fetchOfferRaw);

        let offerData = await traverseProductPageTree(offerPage)

        insertOffer({
            product: offerData["product"],
            price: offerData["price"],
            seller: "trinkgut",
            startDateTime: startDate,
            endDateTime: endDate,
            website: offer
        })
    })

    setLastFetched(monitorName)
}

function traverseTree(tree) {
    const list = []

    traverseTreeRecurse(tree, list)

    return list
}

function traverseTreeRecurse(tree, offerList) {
    if (Array.isArray(tree)) {
        tree.forEach((item) => {
            traverseTreeRecurse(item, offerList)
        })

        return
    }

    if (typeof (tree) === "object") {
        if (Object.keys(tree).includes("@_href")) {
            if (tree["@_href"].includes("aktuelle-angebote")) {
                offerList.push(tree["@_href"])
                return
            }
        }

        if (Object.keys(tree).includes("@_class")) {
            if (tree["@_class"].includes("intro")) {
                offerList.push(tree["#text"])
                return
            }
        }

        Object.keys(tree).forEach((key) => {
            traverseTreeRecurse(tree[key], offerList)
        })
    }
}

function traverseProductPageTree(tree) {
    const list = {}

    traverseProductPageTreeRecurse(tree, list)

    return list
}

function traverseProductPageTreeRecurse(tree, offerList) {
    if (Array.isArray(tree)) {
        tree.forEach((item) => {
            traverseProductPageTreeRecurse(item, offerList)
        })

        return
    }

    if (typeof (tree) === "object") {
        if (Object.keys(tree).includes("@_class")) {
            if (tree["@_class"].includes("product-detail-price product-price")) {
                offerList["price"] = tree["meta"][0]["@_content"]
                return
            }

            if (tree["@_class"].includes("product-detail-name")) {
                offerList["product"] = tree["#text"]
                return
            }

            if (tree["@_class"].includes("product-detail-definition-list")) {
                offerList["unitSize"] = tree["dd"]
                offerList["description"] = tree["div"]["dd"]["#text"]
                return
            }
        }

        Object.keys(tree).forEach((key) => {
            traverseProductPageTreeRecurse(tree[key], offerList)
        })
    }
}