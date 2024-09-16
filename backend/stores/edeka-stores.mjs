import { insertStore } from "../util/database.mjs"

export async function importEdekaStores() {
    let storesPagesCount = Math.ceil(((await (await fetch("https://www.edeka.de/api/marketsearch/markets")).json())["totalCount"] / 999))

    Array.from(Array(storesPagesCount).keys()).forEach(async (number) => {

        let result = await (await fetch(`https://www.edeka.de/api/marketsearch/markets?size=999&page=${number}`)).json()

        result["markets"].forEach(async (store) => {
            insertStore({
                group: "edeka",
                targetApiIdentifier: store["id"],
                data: store
            })
        })
    })
}