import Offer from '../schemas/offerSchema.mjs'
import LastFetch from '../schemas/lastFetchSchema.mjs'

const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
}

export async function insertOffer(offerData) {
    const filterOffer = {
        product: offerData.product,
        seller: offerData.seller,
        price: offerData.price,
        startDateTime: offerData.startDateTime,
        endDateTime: offerData.endDateTime
    }

    try {
        const of = await Offer.findOneAndUpdate(filterOffer, filterOffer, options)
        await of.save()
    } catch (error) {
        console.log(`error import: ${offerData.product} - ${offerData.seller}`)
        return
    }
}

export async function setLastFetched(seller) {
    const filterLastFetch = { seller: seller }
    const update = { fetchTime: (new Date).toISOString() }
    
    const lf = await LastFetch.findOneAndUpdate(filterLastFetch, update, options)
}