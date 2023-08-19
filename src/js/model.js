import "core-js/stable";
import "regenerator-runtime/runtime.js";
import * as leaflet from "./../../node_modules/leaflet/dist/leaflet.js";

export const getPosition = function () {
  navigator.geolocation.getCurrentPosition(getLatLon);
};

export const getLatLon = function (pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  getMeteo(lat, lon);
  getMap(lat, lon);
};

export const getMeteo = async function (lat, lon) {
  try {
    //Fetch Request
    const request = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FLondon`
    );
    const res = await request;
    const data = await res.json();

    //Variable Creation for Meteo
    const latitude = data.latitude;
    const longitude = data.longitude;
    const days = data.daily.time;
    const tempMax = data.daily.temperature_2m_max;
    const tempMin = data.daily.temperature_2m_min;
    const probabilityRain = data.daily.precipitation_probability_max;
    // Return object?
    // return { latitude, longitude, days, tempMax, tempMin, probabilityRain };
  } catch (err) {
    console.error(err);
  }
};

export const getMap = async function (lat, lon) {
  const map = L.map("map").setView([lat, lon], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lon])
    .addTo(map)
    .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    .openPopup();
};
