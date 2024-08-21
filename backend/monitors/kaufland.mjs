import { XMLParser } from "fast-xml-parser";
import { version } from "mongoose";

export async function importKaufland() {
    const monitorName = "kaufland"

    const offSet = 1 * 60 * 60 * 1000
    const timeNow = new Date()
    const lastfetched = new Date((await (await fetch(`http://localhost:3000/lastFetch?seller=${monitorName}`)).json())["fetchTime"])

    if (timeNow - lastfetched < offSet) {
        console.log(`${monitorName} - abort Update`)
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

    let offersStructured = await traverseOffersTree(offersUnstructured)

    const regex = /\d\d\d\d-\d\d-\d\d/gm;

    offersStructured.forEach(async (offer) => {

        if(offer["price"] === 0) {
            return
        }

        try {
            fetch("http://localhost:3000/insertData", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product: `${offer["title"]} ${offer["subtitle"]}`,
                    price: offer["price"],
                    seller: "kaufland",
                    startDateTime: Date.parse(offer["dateFrom"]),
                    endDateTime: Date.parse(offer["dateTo"])
                })
            })
        } catch (error) {

        }
    })
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
        if (Object.keys(tree).includes("offers")) {
            offerList.push(...(tree["offers"]))
            return
        }

        Object.keys(tree).forEach((key) => {
            traverseOffersTreeRecurse(tree[key], offerList)
        })
    }
}