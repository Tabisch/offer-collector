import { json } from "express";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

export async function importLidl() {
    const monitorName = "lidl"

    const offSet = 24 * 60 * 60 * 1000
    const timeNow = new Date()
    const lastfetched = new Date((await (await fetch(`http://localhost:3000/lastFetch?seller=${monitorName}`)).json())["fetchTime"])

    if (timeNow - lastfetched < offSet) {
        console.log(`${monitorName} - abort Update`)
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

        //console.log(dateRegex)

        let start = new Date(now.getFullYear(), dateRegex[2] , dateRegex[1])
        let end = new Date(now.getFullYear(), dateRegex[4] , dateRegex[3])
        //console.log(start + " - " + end)

        try {
            fetch("http://localhost:3000/insertData", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product: offer["fullTitle"],
                    price: offer["price"]["price"],
                    seller: "lidl",
                    startDateTime: start,
                    endDateTime: end
                })
            })
        } catch (error) {

        }
    })
}

function traverseTree(tree) {
    const list = []

    console.log(list)

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

        return
    }
}