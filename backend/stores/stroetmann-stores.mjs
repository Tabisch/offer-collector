import { insertStore } from "../util/database.mjs"

export async function importStroetmannStores() {
    insertStore({
        name: "Großmarkt Münster",
        zipCode: 48163,
        city: "Münster",
        street: "Harkortstraße 30",
        group: "stroetmann",
        longitude: 7.568955711316534,
        latitude: 51.92303270563306,
        targetApiIdentifier: 0,
        data: {},
        website: "https://grossmarkt.stroetmann.de/ueber-uns/standorte/muenster"
    })

    insertStore({
        name: "Großmarkt Gronau",
        zipCode: 48599,
        city: "Gronau",
        street: "Borgwardstraße 4",
        group: "stroetmann",
        longitude: 7.06890965365595,
        latitude: 52.2023635806492,
        targetApiIdentifier: 1,
        data: {},
        website: "https://grossmarkt.stroetmann.de/ueber-uns/standorte/gronau"
    })
}