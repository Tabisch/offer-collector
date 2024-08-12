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

app.post("/insertData", (req, res) => {
    console.log(req.body)

    const of = new Offer({
        product: req.body.product,
        seller: req.body.seller,
        price: req.body.price,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime
    })

    of.save()

    let lf = LastFetch.findOneAndUpdate({
        seller: req.body.seller
    }, {
        seller: req.body.seller,
        fetchTime: (new Date).toISOString()
    }, { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true 
    })

    console.log(lf.seller)

    res.send(200)
})

app.get("/rows", async (req, res) => {
    res.send(await Offer.find())
})

app.get("/lastFetch", async (req, res) => {
    res.send(await LastFetch.findOne({ seller: req.body.seller }))
})

app.get("/overview", async (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/overview.html")
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})

await runMonitors()