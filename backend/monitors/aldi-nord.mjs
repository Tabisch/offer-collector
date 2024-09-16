import { XMLParser } from "fast-xml-parser";
import { insertOffer, setLastFetched } from "../util/database.mjs";
import { allowedToFetch } from "../util/dates.mjs";

export async function importAldiNord() {
    const monitorName = "aldi-nord"

    if(!await allowedToFetch(monitorName)) {
        return
    }

    const fetchRaw = await (await fetch("https://www.aldi-nord.de/angebote.html")).text()

    let linkDays = ["so", "mo", "di", "mi", "do", "fr", "sa"]

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

    let urls = traverseTree(jObj)

    await urls.forEach(async (url) => {
        const fetchOfferRaw = await (await fetch(`https://www.aldi-nord.de${url}`)).text()

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

        if (!Object.keys(offerPage["div"]).includes("@_data-article")) {
            return
        }

        let data = JSON.parse(offerPage["div"]["@_data-article"])

        let datumStart = new Date((new Date(data["productInfo"]["promotionDate"])).getTime()  + 2 * 60 * 60 * 1000)
        let datumEnd = new Date(datumStart.getTime() + (6-datumStart.getDay()) * 24 * 60 * 60 * 1000)

        let weekDay = linkDays[datumStart.getUTCDay()]
        let monthDay = `0${datumStart.getDate()}`.slice(-2)
        let month = `0${datumStart.getMonth() + 1}`.slice(-2)

        let link = `https://www.aldi-nord.de/angebote/aktion-${weekDay}-${monthDay}-${month}/${offerPage["div"]["@_id"]}-0-0.article.html`

        if (Object.keys(offerPage["div"]["div"]).includes("a")) {
            link = `https://www.aldi-nord.de${offerPage["div"]["div"]["a"]["@_href"]}`
        }

        insertOffer({
            product: `${data["productInfo"]["brand"]} ${data["productInfo"]["productName"]}`,
            price: data["productInfo"]["priceWithTax"],
            seller: "aldi-nord",
            startDateTime: datumStart,
            endDateTime: datumEnd,
            website: link
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
        if (Object.keys(tree).includes("@_data-tile-url")) {
            offerList.push(tree["@_data-tile-url"])
            return
        }

        Object.keys(tree).forEach((key) => {
            traverseTreeRecurse(tree[key], offerList)
        })
    }
}