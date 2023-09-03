import "core-js/stable";
import "regenerator-runtime/runtime.js";
("use strict");

//////////////////DOM ELEMENTS////////////////////
const giorni = document.querySelectorAll(".giorni");

/////////////////////////////////////////////////

class App {
  constructor() {
    this.getPosition();
    this.lat = null;
    this.lon = null;
    this.days = null;
    this.tempMax = null;
    this.tempMin = null;
    this.probabilityRain = null;
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition(this._getLatLon.bind(this));
  }

  _getLatLon(pos) {
    this.lat = pos.coords.latitude;
    this.lon = pos.coords.longitude;
    this._getMap();
    this._getMeteo();
    this._getCityName();
  }

  _getMap() {
    const map = L.map("map").setView([this.lat, this.lon], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([this.lat, this.lon])
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }

  async _getMeteo() {
    try {
      //Fetch Request
      const request = fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FLondon`
      );
      const res = await request;
      const data = await res.json();

      //Variable Creation for Meteo
      this.days = data.daily.time;
      this.tempMax = data.daily.temperature_2m_max;
      this.tempMin = data.daily.temperature_2m_min;
      this.probabilityRain = data.daily.precipitation_probability_max;
      console.log(data);
      //METTO TUTTO NELLA UI
      this.daysMarkup();
      ////////////////////////////////
      console.log(this.tempMax);
      console.log(this.tempMin);

      //forse la levo la probabilità di pioggia
      console.log(this.probabilityRain);
    } catch (err) {
      console.error(err);
    }
  }

  async _getCityName() {
    try {
      //API PER PRENDERE IL NOME IN BASE A LAT E LON
      // https://nominatim.org/release-docs/latest/api/Reverse/
      const cityRequest = fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.lat}&lon=${this.lon}`
      );
      const cityRes = await cityRequest;
      const cityData = await cityRes.json();
      const city = cityData.address.city;
      document.querySelector(".city").textContent = city;
    } catch (err) {
      console.error(err);
    }
  }

  daysMarkup() {
    //Ristrutturazione days:
    const newDays = this.days.map((e) =>
      e.slice(5, 10).split("-").reverse().join("/")
    );
    console.log(newDays);
    giorni.forEach(function (e, i) {
      if (i < newDays.length) {
        e.textContent = newDays[i];
      }
    });
  }
}

const app = new App();
