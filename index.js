const express = require("express")
const db = require("database")

const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello")
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})