import { importLidl } from "./monitors/lidl.mjs";
import { importStroetmann } from "./monitors/stroetmann.mjs";
import { importPenny } from "./monitors/penny.mjs";
import { importTrinkgut } from "./monitors/trinkgut.mjs";
import { importKaufland } from "./monitors/kaufland.mjs";
import { importAldiNord } from "./monitors/aldi-nord.mjs";

export async function runMonitors() {
    importStroetmann()
    importPenny()
    importLidl()
    importTrinkgut()
    importKaufland()
    importAldiNord()
}

setInterval(runMonitors, (5 * 60 * 1000));