import requests
import json

collections = requests.get("https://katalog.stroetmann.de/api/collections/me").json()

#print(json.dumps(collections, indent=4))

offerlist = []

for collection in collections:
    print(f"{collection["_id"]} - {collection["from"]} - {collection["until"]}")

    offers = requests.get(f"https://katalog.stroetmann.de/api/collections/{collection["_id"]}").json()["slots"]

    #print(len(offers))
    #print(json.dumps(offers, indent=4))

    for offer in offers:
        product = f"{offer["articles"][0]["text"][0]} {offer["articles"][0]["text"][1]}"

        offerlist.append({
            "product": product,
            "seller": "stroetmann",
            "price": offer["articles"][0]["brutto"],
            "startDateTime": collection["from"],
            "endDateTime": collection["until"]
        })

#print(offerlist)

for offer in offerlist:
    requests.post("http://localhost:3000/insertData", json=offer)