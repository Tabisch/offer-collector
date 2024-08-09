import requests
import json
import datetime

date = datetime.datetime.now()

#print(datetime.datetime.fromisocalendar(date.isocalendar().year, date.isocalendar().week, 0 + 1 ))

collections = requests.get(f"https://www.penny.de/.rest/offers/{date.isocalendar().year}-{date.isocalendar().week}").json()[0]

# f = open("dump_data.txt", "w")
# f.write(json.dumps(collections, indent=4))
# f.close()

categoryDateRanges = {}
offers = []

for categoriesMenuPeriodKey in collections["categoriesMenuPeriod"].keys():
    # print(collections["categoriesMenuPeriod"][categoriesMenuPeriodKey]["slug"])
    # print(f"startTime: {datetime.datetime.fromisocalendar(date.isocalendar().year, date.isocalendar().week, collections["categoriesMenuPeriod"][categoriesMenuPeriodKey]["startDayIndex"] + 1).strftime('%Y-%m-%dT%H:%M:%SZ')}")
    # print(f"endTime: {datetime.datetime.fromisocalendar(date.isocalendar().year, date.isocalendar().week, collections["categoriesMenuPeriod"][categoriesMenuPeriodKey]["endDayIndex"] + 1).strftime('%Y-%m-%dT%H:%M:%SZ')}")

    categoryDateRanges[collections["categoriesMenuPeriod"][categoriesMenuPeriodKey]["slug"]] = {
        "startTime": datetime.datetime.fromisocalendar(date.isocalendar().year, date.isocalendar().week, collections["categoriesMenuPeriod"][categoriesMenuPeriodKey]["startDayIndex"] + 1).strftime('%Y-%m-%dT%H:%M:%SZ'),
        "endTime": datetime.datetime.fromisocalendar(date.isocalendar().year, date.isocalendar().week, collections["categoriesMenuPeriod"][categoriesMenuPeriodKey]["endDayIndex"] + 1).strftime('%Y-%m-%dT%H:%M:%SZ')
    }

#print(json.dumps(categoryDateRanges, indent=4))

for category in collections["categories"]:
    for range in categoryDateRanges.keys():
        if range in category["id"]:
            for offer in category["offerTiles"]:
                if "title" in offer.keys():
                    price = 0
                    try:
                        price = float(offer["price"].replace("*",""))
                    except:
                        continue

                    offers.append({
                        "product": offer["title"],
                        "price": offer["price"].replace("*",""),
                        "seller": "penny",
                        "startDateTime": categoryDateRanges[range]["startTime"],
                        "endDateTime": categoryDateRanges[range]["endTime"]
                    })

# print(json.dumps(splitCategories, indent=4))

# f = open("offersSplit.txt", "w")
# f.write(json.dumps(offers, indent=4))
# f.close()

for offer in offers:
    requests.post("http://localhost:3000/insertData", json=offer)