import { XMLParser } from "fast-xml-parser";
import { insertStore } from "../util/database.mjs";

export async function importTrinkgutStores() {
    const storesRaw = await (await fetch("https://www.trinkgut.de/maerkte/?sword=99820")).text()

    const options = {
        ignoreAttributes: false,
        // preserveOrder: true,
        unpairedTags: ["hr", "br", "link", "meta"],
        stopNodes: ["*.pre", "*.script"],
        processEntities: true,
        htmlEntities: true
    };

    const parser = new XMLParser(options);

    let storesParsed = await parser.parse(storesRaw)
    let storesJson = JSON.parse(storesParsed.html.body.header.div.nav.div[1].form.div[2].div.nav.div.main.div.div.div.div.div.div.div.div.div[1].div[1].div.div.div[1].div.div.div[1].script["#text"])
    storesJson.forEach((store) => {
        insertStore({
            group: "trinkgut",
            targetApiIdentifier: store["id"],
            data: store
        })
    })
}