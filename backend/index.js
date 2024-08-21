import express from 'express'
import cors from 'cors'
import path from 'path'
import Offer from './schemas/offerSchema.mjs'
import LastFetch from './schemas/lastFetch.mjs'
import { runMonitors } from './runMonitors.mjs'
import { importKaufland } from './monitors/kaufland.mjs'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/index.html")
})

app.get("/insertData", (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/insert.html")
})

// app.get("/debugJson", async (req, res) => {
//     res.send(await importKaufland())
// })

app.post("/insertData", async (req, res) => {
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
        console.log(error)
        res.sendStatus(400)
        return
    }

    const filterLastFetch = { seller: req.body.seller }
    const update = { fetchTime: (new Date).toISOString() }
    
    const lf = await LastFetch.findOneAndUpdate(filterLastFetch, update, options)

    res.sendStatus(200)
})

app.get("/rows", async (req, res) => {
    res.send(await Offer.find())
})

app.get("/lastFetch", async (req, res) => {
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

app.get("/overview", async (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/overview.html")
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

runMonitors()