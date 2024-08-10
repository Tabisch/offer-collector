const express = require("express")
const path = require('path');
const Offer = require('./schemas/offerSchema')

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

    res.sendFile(path.join(__dirname) + "/static/insertDone.html")
})

app.get("/rows", async (req, res) => {
    seller = req.query.seller

    let offers = {}

    if(seller) {
        offers = await Offer.find({"seller": seller})
    } else {
        offers = await Offer.find()
    }

    res.send(offers)
})

app.get("/overview", async (req, res) => {
    res.sendFile(path.join(__dirname) + "/static/overview.html")
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})