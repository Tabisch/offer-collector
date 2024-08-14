import express from 'express'
import path from 'path'
import Offer from './schemas/offerSchema.mjs'
import LastFetch from './schemas/lastFetch.mjs'
import { runMonitors } from './runMonitors.mjs'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/index.html")
})

app.get("/insertData", (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/insert.html")
})

app.post("/insertData", async (req, res) => {
    console.log(req.body.seller)

    const of = new Offer({
        product: req.body.product,
        seller: req.body.seller,
        price: req.body.price,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime
    })

    await of.save()

    const filter = { seller: req.body.seller }
    const update = { fetchTime: (new Date).toISOString() }
    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }

    const lf = await LastFetch.findOneAndUpdate(filter, update, options)

    res.send(200)
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