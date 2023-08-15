import "core-js/stable";
import "regenerator-runtime/runtime.js";
import * as leaflet from "./../../node_modules/leaflet/dist/leaflet.js";

export const getPosition = async function () {
  try {
    const pos = function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log(`Ti trovi a Latutudine: ${lat} e Longitudine: ${lon}`);
    };
    navigator.geolocation.getCurrentPosition(pos);
  } catch (err) {
    console.error(err);
  }
};
