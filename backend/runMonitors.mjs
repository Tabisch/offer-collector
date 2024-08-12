import { importLidl } from "./monitors/lidl.mjs";
import { importStroetmann } from "./monitors/stroetmann.mjs";

export async function runMonitors() {
    await importStroetmann()
}