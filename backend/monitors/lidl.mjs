import { XMLParser } from "fast-xml-parser";
import { insertOffer, setLastFetched } from "../util/database.mjs";
import { allowedToFetch } from "../util/dates.mjs";

export async function importLidl() {
    const monitorName = "lidl"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    const fetchRaw = await (await fetch("https://www.lidl.de/c/billiger-montag/a10006065?channel=store&tabCode=Current_Sales_Week")).text()

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

    let offers = traverseTree(jObj)

    const regex = /.+ (\d+)\.(\d+)\. - (\d+)\.(\d+)\./
    let now = new Date()

    offers.forEach((offer) => {
        //console.log(offer["fullTitle"])

        let dateRegex = regex.exec(offer["stockAvailability"]["badgeInfo"]["badges"][0]["text"])

        let start = new Date(now.getFullYear(), dateRegex[2] -1 , dateRegex[1])
        let end = new Date(now.getFullYear(), dateRegex[4] -1 , dateRegex[3])

        // if(offer["fullTitle"] === "Volvic Touch & Tee") {
        //     console.log(dateRegex)
        //     console.log(start + " - " + end)
        // }

        insertOffer({
            product: offer["fullTitle"],
            price: offer["price"]["price"],
            seller: "lidl",
            startDateTime: start,
            endDateTime: end
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
    //console.log(offerList)

    if (Array.isArray(tree)) {
        tree.forEach((item) => {
            traverseTreeRecurse(item, offerList)
        })

        return
    }

    if (typeof (tree) === "object") {
        if (Object.keys(tree).includes("@_data-grid-data")) {
            let data = JSON.parse(tree["@_data-grid-data"])[0]
            //console.log(data["fullTitle"])

            return offerList.push(data)
        }

        Object.keys(tree).forEach((key) => {
            traverseTreeRecurse(tree[key], offerList)
        })
    }
}