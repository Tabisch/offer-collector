import { insertStore } from "../util/database.mjs";

export async function importKauflandStores() {
    let stores = await (await fetch("https://filiale.kaufland.de/.klstorefinder.json")).json()

    stores.forEach(store => {
        insertStore({
            name: store["cn"],
            zipCode: store["pc"],
            city: store["t"],
            street: store["sn"],
            group: "kaufland",
            longitude: store["lng"],
            latitude: store["lat"],
            targetApiIdentifier: store["n"],
            data: store,
            website: `https://filiale.kaufland.de/service/filiale/${store["ahaus-1300"]}.html`
        })
    });
}