import { insertStore } from "../util/database.mjs"

export async function importPennyStores() {
    const stores = await (await fetch("https://www.penny.de/.rest/market")).json()

    stores.forEach(store => {
        insertStore({
            name: store["marketName"],
            zipCode: store["zipCode"],
            city: store["city"],
            street: store["streetWithHouseNumber"],
            group: "penny",
            longitude: store["longitude"],
            latitude: store["latitude"],
            targetApiIdentifier: store["@id"],
            data: store,
            website: `https://www.penny.de/${store["citySlug"]}/${store["wwIdent"]}/${store["slug"]}`
        })
    });
}