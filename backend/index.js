import express from 'express'
import cors from 'cors'
import path from 'path'
import Offer from './schemas/offerSchema.mjs'
import LastFetch from './schemas/lastFetchSchema.mjs'
import { runMonitors } from './runMonitors.mjs'
import Store from './schemas/storeSchema.mjs'
import { getRows, updateOfferCache } from './util/database.mjs'
import { __dirname, __filename } from './config.mjs';

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

console.log(path.join(__dirname, 'static/'))

app.use(express.static(path.join(__dirname, 'static/'),{extensions: ["js"]}))

app.get('/', (req, res) => {
    res.redirect('/frontend/')
});

app.get('/frontend/*', (req, res) => {
    if(req.url.includes('.js')) {
        let split = req.originalUrl.split('/')

        res.sendFile(path.join(__dirname, `static/${split[split.length - 1]}`));
        return
    }
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

// app.get("/devDebug", async (req, res) => {
//     res.send(await importAldiNord())
// })

app.post("/api/insertData", async (req, res) => {
    //console.log(req.body.seller)

    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }

    const filterOffer = {
        product: req.body.product,
        seller: req.body.seller,
        price: req.body.price,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime
    }

    const of = await Offer.findOneAndUpdate(filterOffer, filterOffer, options)

    try {
        await of.save()
    } catch (error) {
        console.log(`error import: ${req.body.product} - ${req.body.seller}`)
        res.sendStatus(400)
        return
    }

    res.sendStatus(200)
})

app.post("/api/insertStore", async (req, res) => {
    //console.log(req.body.seller)

    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }

    const filterOffer = {
        name: req.body.name,
        group: req.body.group,
        targetApiIdentifier: req.body.targetApiIdentifier
    }

    const st = await Store.findOneAndUpdate(filterOffer, filterOffer, options)

    try {
        await st.save()
    } catch (error) {
        console.log(`error import: ${req.body.name} - ${req.body.group} - ${req.body.targetApiIdentifier}`)
        res.sendStatus(400)
        return
    }
})

app.get("/api/rows", async (req, res) => {
    res.type('application/json')
    res.send(await getRows())
})

app.get("/api/lastFetch", async (req, res) => {
    const last = await LastFetch.findOne({ seller: req.query.seller }, { _id: 0, __v: 0 })

    if (last === null) {
        res.send({
            seller: req.query.seller,
            fetchTime: "1970-01-01T00:00:00.000Z"
        })
    } else {
        res.send(last)
    }
})

app.listen(port, () => {
    console.log(`App listening on ${port} - ${new Date().toISOString()}`)
})

runMonitors()
updateOfferCache()