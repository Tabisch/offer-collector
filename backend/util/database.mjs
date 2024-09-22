import Offer from '../schemas/offerSchema.mjs'
import LastFetch from '../schemas/lastFetchSchema.mjs'
import Store from '../schemas/storeSchema.mjs'
import { runStoresImport } from '../runStoresImport.mjs'
import { runMonitors } from '../runMonitors.mjs'

const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
}

let offerCache = {}

export async function updateOfferCache() {
    console.log("Updating Cache")
    offerCache = JSON.stringify(await Offer.find({ endDateTime: { $gte: (new Date(Date.now())).setHours(0, 0, 0, 0) } }))
    //offerCache = JSON.stringify(await Offer.find({}))
}

export async function insertOffer(offerData) {
    const filterOffer = {
        product: offerData.product,
        seller: offerData.seller,
        price: offerData.price,
        startDateTime: offerData.startDateTime,
        endDateTime: offerData.endDateTime
    }

    const insertOffer = {
        product: offerData.product,
        seller: offerData.seller,
        price: offerData.price,
        startDateTime: offerData.startDateTime,
        endDateTime: offerData.endDateTime,
        website: offerData.website
    }

    try {
        const of = await Offer.findOneAndUpdate(filterOffer, insertOffer, options)
        await of.save()
    } catch (error) {
        console.log(`error import: ${offerData.product} - ${offerData.seller}`)
        return
    }
}

export async function insertStore(storeData) {
    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }

    const filterStore = {
        group: storeData["group"],
        targetApiIdentifier: storeData["targetApiIdentifier"],
    }

    const storeInsert = {
        name: storeData["name"],
        zipCode: storeData["zipCode"],
        city: storeData["city"],
        street: storeData["street"],
        group: storeData["group"],
        location: {
            type: 'Point',
            coordinates: [storeData["longitude"], storeData["latitude"]]
        },
        targetApiIdentifier: storeData["targetApiIdentifier"],
        data: storeData["data"],
        website: storeData["website"]
    }

    const st = await Store.findOneAndUpdate(filterStore, storeInsert, options)

    try {
        await st.save()
    } catch (error) {
        console.log(`error import: ${storeData["group"]} - ${storeData["targetApiIdentifier"]}`)
        return
    }
}

export async function setStoreSelectedState(data) {
console.log(data)

    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }

    const filterStore = {
        group: data["group"],
        targetApiIdentifier: data["targetApiIdentifier"],
    }

    const st = await Store.findOneAndUpdate(filterStore, {selected: data["selected"]}, options)

    try {
        await st.save()
    } catch (error) {
        console.log(`error import: ${data["group"]} - ${data["targetApiIdentifier"]}`)
        return
    }
}

export async function setLastFetched(importer, type = "offer") {
    const filterLastFetch = { importer: importer }
    const update = { 
        fetchTime: (new Date).toISOString(),
        type: type
    }

    const lf = await LastFetch.findOneAndUpdate(filterLastFetch, update, options)
}

export async function emptyOffers() {
    console.log("emptyOffers")
    await Offer.deleteMany({})
    await LastFetch.deleteMany({ type: "offers"})

    await runMonitors()
}

export async function emptyStores() {
    console.log("emptyStores")
    await Store.deleteMany({})
    await LastFetch.deleteMany({ type: "Stores"})

    runStoresImport()
}

export async function getOffers() {
    return offerCache
}

export async function getStores(latitude, longitude, radius) {
    if(latitude && longitude && radius) {
        return Store.find({
            location :{
                $near: {
                    $maxDistance: radius,
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    }
                }
            }
        }).select("-data")
    } else {
        return Store.find({}).select("-data")
    }
}