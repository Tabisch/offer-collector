import requests
import json
import datetime
from bs4 import BeautifulSoup
import re

offersSite = requests.get("https://www.trinkgut.de/angebote/?market=722d7aab-9951-4d80-a52c-684479bf14c0").text

offersSoup = BeautifulSoup(offersSite, 'html.parser')

datesRegexGroups = re.match(r"^[^0-9]+(\d\d\.\d\d\.\d\d\d\d)[^0-9]+(\d\d\.\d\d\.\d\d\d\d)[^0-9]+$",offersSoup.find("p", {"class": "intro"}).text).groups()

startDateTime = datetime.datetime.strptime(datesRegexGroups[0], '%d.%m.%Y').strftime('%Y-%m-%dT%H:%M:%SZ')
endDateTime = datetime.datetime.strptime(datesRegexGroups[1], '%d.%m.%Y').strftime('%Y-%m-%dT%H:%M:%SZ')

offersListSoup = offersSoup.find_all("div", {"class": "product-info"})

offers= []

for offer in offersListSoup:
    offers.append({
        "product": offer.find("p", {"class": "product-name"}).text.strip(),
        "price": float(offer.find("p", {"class": "product-price"}).text.replace("ab","").strip()),
        "seller": "trinkgut",
        "startDateTime": startDateTime,
        "endDateTime": endDateTime
    })

for offer in offers:
    requests.post("http://localhost:3000/insertData", json=offer)