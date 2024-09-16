export async function importLidlStores() {
    return

    let stores = []

    for (let i = 0; i < 10; i++) {
        let zipStores = await (await fetch(`https://sdk.virtualearth.net/api/v6/Places/AutoSuggest?q=${i}&appid=F2DD9E3AA45F7512D9C6CA9A150CBA7F76556B81&mv8cid=undefined&mv8ig=7F00DB313E9645068CC5CBE2E6832BA3&localMapView=54.355784376735585,4.953835937500015,47.66634501570266,15.940164062500015&localcircularview=&count=20&structuredaddress=true&types=place,address&setmkt=de-DE&setlang=de-DE&histcnt=&favcnt=&constraints=country:DE&clientid=0368EDF67186610E10D9F90A700D601B`)).json()
        
        stores = stores.concat(zipStores["value"])
    }

    stores.forEach(store => {
        insertStore({
            name: store["marketName"],
            zipCode: store["address"]["postalCode"],
            city: store["city"],
            street: store["address"]["address"],
            group: "Lidl",
            longitude: store["geo"]["longitude"],
            latitude: store["geo"]["latitude"],
            targetApiIdentifier: store["@id"],
            data: store,
            website: `https://www.penny.de/${store["citySlug"]}${store["wwIdent"]}${store["slug"]}`
        })
    });
}