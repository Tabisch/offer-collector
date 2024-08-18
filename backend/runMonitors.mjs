import { importLidl } from "./monitors/lidl.mjs";
import { importStroetmann } from "./monitors/stroetmann.mjs";
import { importPenny } from "./monitors/penny.mjs";

export async function runMonitors() {
    importStroetmann()
    importPenny()
    importLidl()
}

setInterval(runMonitors, (5 * 60 * 1000));