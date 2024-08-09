import requests
import json
import datetime
from bs4 import BeautifulSoup

maerkte = requests.get("https://www.trinkgut.de/maerkte/").text

maerkteSoup = BeautifulSoup(maerkte)

storesList = json.loads((maerkteSoup.find("script", {"id": "markets--data"})).get_text())

#print(json.dumps(storesList, indent=4))

f = open("dump_stores.txt", "w")
f.write(json.dumps(storesList, indent=4))
f.close()