import "core-js/stable";
import "regenerator-runtime/runtime.js";
("use strict");

//////////////////DOM ELEMENTS////////////////////
const giorni = document.querySelectorAll(".giorni");

/////////////////////////////////////////////////

class App {
  constructor() {
    this.getPosition();
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition(this._getLatLon.bind(this));
  }

  _getLatLon(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    this._getMap(lat, lon);
    this._getMeteo(lat, lon);
  }

  _getMap(lat, lon) {
    const map = L.map("map").setView([lat, lon], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }

  async _getMeteo(lat, lon) {
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

      //METTO TUTTO NELLA UI
      console.log(data);
      //Mi servono per trovare il nome del luogo e metterlo nella UI
      //Usiamo questa API
      // https://nominatim.org/release-docs/latest/api/Reverse/
      const cityRequest = fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const cityRes = await cityRequest;
      const cityData = await cityRes.json();
      const city = cityData.address.city;
      document.querySelector(".city").textContent = city;

      //array di giorni e temperature, da scompattare e sostituire nella UI

      //Ristrutturazione days:
      const newDays = days.map((e) =>
        e.slice(5, 10).split("-").reverse().join("/")
      );
      console.log(newDays);
      giorni.forEach(function (e, i) {
        if (i < newDays.length) {
          e.textContent = newDays[i];
        }
      });

      ////////////////////////////////
      console.log(tempMax);
      console.log(tempMin);

      //forse la levo la probabilità di pioggia
      console.log(probabilityRain);
    } catch (err) {
      console.error(err);
    }
  }
}

const app = new App();
