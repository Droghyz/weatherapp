import "core-js/stable";
import { nextTick } from "process";
import "regenerator-runtime/runtime.js";
("use strict");

//////////////////DOM ELEMENTS////////////////////
const giorni = document.querySelectorAll(".giorni");
const maxTempUi = document.querySelectorAll(".max-temp");
const minTempUi = document.querySelectorAll(".min-temp");
const dayIcon = document.querySelectorAll(".day-icon");
const btnAvanti = document.querySelector(".btn-next");
const bntIndietro = document.querySelector(".btn-previous");
const venti = document.querySelectorAll(".venti");
const probPioggiaEl = document.querySelectorAll(".pioggia");
const checkState = document.querySelector(".check");

//ANNO PER IL COPYRIGHT
document.getElementById("current-year").textContent = new Date().getFullYear();

/////////////////////////////////////////////////

class App {
  constructor() {
    this.getPosition();
    this.lat = null;
    this.lon = null;
    this.days = null;
    this.tempMax = null;
    this.tempMin = null;
    this.weathercode = null;
    this.ventoDirezione = null;
    this.ventoForza = null;
    this.probPioggia = null;
    this.currentIndex = 0;
    this.state = {
      daysIndex: 0,
      tempMaxIndex: 0,
      tempMinIndex: 0,
      ventiIndex: 0,
      pioggiaIndex: 0,
      conditionIndex: 0,
    };
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
    const map = L.map("map").setView([this.lat, this.lon], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([this.lat, this.lon])
      .addTo(map)
      .bindPopup("You are here right now!")
      .openPopup();
  }

  async _getMeteo() {
    try {
      //Fetch Request
      const request = fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&timezone=Europe%2FLondon`
      );
      const res = await request;
      const data = await res.json();
      //Variable Creation for Meteo
      this.days = data.daily.time;
      this.tempMax = data.daily.temperature_2m_max;
      this.tempMin = data.daily.temperature_2m_min;
      this.weathercode = data.daily.weathercode;
      this.ventoDirezione = data.daily.winddirection_10m_dominant;
      this.ventoForza = data.daily.windspeed_10m_max;
      this.probPioggia = data.daily.precipitation_probability_max;
      //METTO TUTTO NELLA UI
      this.daysMarkup();
      this.tempMarkupMax();
      this.tempMarkupMin();
      this.ventiMarkUp();
      this.conditionMarkup();
      this.pioggiaMarkUp();
      ////////////////////////////////
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
      const town = cityData.address.town;
      const village = cityData.address.village;

      if (!city && !town) {
        document.querySelector(".city").textContent = village;
      }
      if (!village && !town) {
        document.querySelector(".city").textContent = city;
      }
      if (!city && !village) {
        document.querySelector(".city").textContent = town;
      }
    } catch (err) {
      console.error(err);
    }
  }

  updateState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
    console.log(this.state);
    return this.state;
  }

  nextPage(dom, value, field) {
    btnAvanti.addEventListener("click", () => {
      const state = this.state[field];
      if (state < value.length - 1) {
        const newState = { [field]: state + 1 };
        dom.textContent = value[state + 1];
        this.updateState(newState);
      }
    });
  }

  nextSVG(dom, value, field) {
    btnAvanti.addEventListener("click", () => {
      const state = this.state[field];
      if (state < value.length - 1) {
        const newState = { [field]: state + 1 };
        dom.firstChild.remove();
        dom.insertAdjacentHTML("beforeend", value[state + 1]);
        this.updateState(newState);
      }
    });
  }

  prevPage(dom, value, field) {
    bntIndietro.addEventListener("click", () => {
      const state = this.state[field];
      if (state > 0) {
        const newState = { [field]: state - 1 };
        dom.textContent = value[state - 1];
        this.updateState(newState);
      }
    });
  }

  prevSVG(dom, value, field) {
    bntIndietro.addEventListener("click", () => {
      const state = this.state[field];
      if (state > 0) {
        const newState = { [field]: state - 1 };
        dom.firstChild.remove();
        dom.insertAdjacentHTML("beforeend", value[state - 1]);
        this.updateState(newState);
      }
    });
  }

  daysMarkup() {
    let days = this.state.daysIndex;
    // Ristrutturazione days:
    const newDays = this.days.map((e) => e.slice(8, 10).split("-").join());
    const months = this.days.map((e) => e.slice(5, 10).split("-")[0]);
    for (let i = 0; i < months.length; i++) {
      if (months[i] === "01") {
        months[i] = "Gennaio";
      }
      if (months[i] === "02") {
        months[i] = "Febbraio";
      }
      if (months[i] === "03") {
        months[i] = "Marzo";
      }
      if (months[i] === "04") {
        months[i] = "Aprile";
      }
      if (months[i] === "05") {
        months[i] = "Maggio";
      }
      if (months[i] === "06") {
        months[i] = "Giugno";
      }
      if (months[i] === "10") {
        months[i] = "Ottobre";
      }
      if (months[i] === "07") {
        months[i] = "Luglio";
      }
      if (months[i] === "08") {
        months[i] = "Agosto";
      }
      if (months[i] === "09") {
        months[i] = "Settembre";
      }
      if (months[i] === "10") {
        months[i] = "Ottobre";
      }
      if (months[i] === "11") {
        months[i] = "Novembre";
      }
      if (months[i] === "12") {
        months[i] = "Dicembre";
      }
    }
    const goodDays = newDays.map((e, i) => e + ` ${months[i]}`);
    giorni.forEach((e, i) => {
      if (i === days) {
        e.textContent = goodDays[days];
      }
      this.nextPage(e, goodDays, "daysIndex");
      this.prevPage(e, goodDays, "daysIndex");
    });
  }

  tempMarkupMax() {
    const maxTemp = this.tempMax;
    const newMaxTemp = Array.from(maxTemp.map((e) => Math.floor(e) + `°`));
    maxTempUi.forEach((e, i) => {
      if (i < newMaxTemp.length) {
        e.textContent = newMaxTemp[i];
      }
      this.nextPage(e, newMaxTemp, "tempMaxIndex");
      this.prevPage(e, newMaxTemp, "tempMaxIndex");
    });
  }

  tempMarkupMin() {
    const minTemp = this.tempMin;
    const newMinTemp = Array.from(minTemp.map((e) => Math.floor(e) + `°`));
    minTempUi.forEach((e, i) => {
      if (i < newMinTemp.length) {
        e.textContent = newMinTemp[i];
      }
      this.nextPage(e, newMinTemp, "tempMinIndex");
      this.prevPage(e, newMinTemp, "tempMinIndex");
    });
  }

  ventiMarkUp() {
    const direzione = this.ventoDirezione;
    const forza = this.ventoForza;
    const newForza = Array.from(forza.map((e) => e + ` Km/h`));
    const windDirection = function (value) {
      if (value >= 0 && value <= 45) {
        return "Nord Est";
      }
      if (value >= 45 && value <= 90) {
        return "Est";
      }
      if (value >= 90 && value <= 135) {
        return "Sud Est";
      }
      if (value >= 135 && value <= 180) {
        return "Sud";
      }
      if (value >= 180 && value <= 225) {
        return "Sud Ovest";
      }
      if (value >= 225 && value <= 270) {
        return "Ovest";
      }
      if (value >= 270 && value <= 315) {
        return "Nord Ovest";
      }
      if (value >= 315 && value <= 360) {
        return "Nord";
      }
    };
    const newDir = direzione.map((e) => windDirection(e));
    const newForzaDir = newForza.map((e, i) => `${e} ${newDir[i]}`);
    venti.forEach((e, i) => {
      if (i < newForzaDir.length) {
        e.textContent = newForzaDir[i];
      }
      this.nextPage(e, newForzaDir, "ventiIndex");
      this.prevPage(e, newForzaDir, "ventiIndex");
    });
  }

  pioggiaMarkUp() {
    const pioggia = this.probPioggia;
    const pioggiaPercent = Array.from(pioggia.map((e) => Math.floor(e) + `%`));

    probPioggiaEl.forEach((e, i) => {
      if (i < pioggiaPercent.length) {
        e.textContent = pioggiaPercent[i];
      }
      this.nextPage(e, pioggiaPercent, "pioggiaIndex");
      this.prevPage(e, pioggiaPercent, "pioggiaIndex");
    });
  }

  // generateIcon(condition, i, e) {
  //   //SOLE
  //   if (condition[i] >= 0 && condition[i] <= 3) {
  //     e.insertAdjacentHTML(
  //       "afterbegin",
  //       `<svg
  //          xmlns="http://www.w3.org/2000/svg"
  //          width="24"
  //          height="24"
  //          viewBox="0 0 24 24"
  //          class="day-icon"
  //        >
  //          <path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm2.312-4.897c0 2.206 1.794 4 4 4s4-1.794 4-4-1.794-4-4-4-4 1.794-4 4zm10 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" />
  //        </svg>
  //      `
  //     );
  //   }

  //   //Nebbia
  //   if (condition[i] >= 45 && condition[i] <= 48) {
  //     e.insertAdjacentHTML(
  //       "beforeend",
  //       `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="day-icon"><path d="M20.422 8.516c-.178-3.232-3.031-5.777-6.432-5.491-1.087-1.24-2.693-2.025-4.49-2.025-3.172 0-5.754 2.443-5.922 5.516-2.033.359-3.578 2.105-3.578 4.206 0 2.362 1.949 4.278 4.354 4.278h1.326c.771 1.198 2.124 2 3.674 2h10.291c2.406 0 4.355-1.916 4.355-4.278 0-2.101-1.545-3.847-3.578-4.206zm-15.395 4.484h-.673c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209.967 0 1.714.25 2.29.645-1.823.921-3.096 2.745-3.212 4.871-2.022.357-3.697 2.127-3.551 4.484zm14.618 2h-10.291c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.257-1.057 2.278-2.355 2.278zm4.355 5h-19v-2h19v2zm0 3h-19v-2h19v2z"/></svg>`
  //     );
  //   }

  //   //PIOGGIA
  //   if (condition[i] >= 51 && condition[i] <= 67) {
  //     e.insertAdjacentHTML(
  //       "beforeend",
  //       `<svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width="24"
  //     height="24"
  //     viewBox="0 0 24 24"
  //     class="day-icon"
  //   >
  //     <path
  //       d="M20.422 7.516c-.178-3.233-3.031-5.778-6.432-5.492-1.087-1.239-2.693-2.024-4.49-2.024-3.172 0-5.754 2.443-5.922 5.516-2.033.359-3.578 2.105-3.578 4.206 0 2.362 1.949 4.278 4.354 4.278h1.326c.771 1.198 2.124 2 3.674 2h10.291c2.406 0 4.355-1.916 4.355-4.278 0-2.101-1.545-3.847-3.578-4.206zm-15.395 4.484h-.673c-1.297 0-2.354-1.022-2.354-2.278 0-2.118 2.104-2.597 3.488-2.512-.05-1.356.137-5.21 4.012-5.21.967 0 1.714.25 2.29.644-1.823.922-3.096 2.746-3.212 4.872-2.022.358-3.697 2.127-3.551 4.484zm14.618 2h-10.291c-1.297 0-2.354-1.022-2.354-2.278 0-2.118 2.104-2.597 3.488-2.512-.05-1.356.137-5.21 4.012-5.21 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.256-1.057 2.278-2.355 2.278zm-12.776 6.713l-1.41-1.41 2.303-2.303 1.41 1.41-2.303 2.303zm-3.3 3.287l-1.41-1.397 2.303-2.303 1.41 1.41-2.303 2.29zm8.253-3.287l-1.41-1.41 2.303-2.303 1.41 1.41-2.303 2.303zm-3.3 3.287l-1.41-1.397 2.303-2.303 1.41 1.41-2.303 2.29zm8.175-3.287l-1.41-1.41 2.303-2.303 1.41 1.41-2.303 2.303zm-3.301 3.287l-1.41-1.397 2.303-2.303 1.41 1.41-2.303 2.29z"
  //     />
  //   </svg>`
  //     );
  //   }

  //   //Neve
  //   if (condition[i] >= 71 && condition[i] <= 77) {
  //     e.insertAdjacentHTML(
  //       "beforeend",
  //       `<svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       class="day-icon"
  //     >
  //       <path
  //         d="M20.422 8.516c-.178-3.232-3.031-5.777-6.432-5.491-1.087-1.24-2.693-2.025-4.49-2.025-3.172 0-5.754 2.443-5.922 5.516-2.033.359-3.578 2.105-3.578 4.206 0 2.362 1.949 4.278 4.354 4.278h1.326c.771 1.198 2.124 2 3.674 2h10.291c2.406 0 4.355-1.916 4.355-4.278 0-2.101-1.545-3.847-3.578-4.206zm-15.395 4.484h-.673c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209.967 0 1.714.25 2.29.645-1.823.921-3.096 2.745-3.212 4.871-2.022.357-3.697 2.127-3.551 4.484zm14.618 2h-10.291c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.257-1.057 2.278-2.355 2.278zm2.105 4.25c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm-4 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm-4 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm-4 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm2 2.5c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm4.094 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm3.906 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25z"
  //       />
  //     </svg>`
  //     );
  //   }

  //   //Temporali
  //   if (condition[i] >= 80 && condition[i] <= 99) {
  //     e.insertAdjacentHTML(
  //       "beforeend",
  //       `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="day-icon"><path d="M15 17h3l-6 7 2-5h-3l2.802-6h3.042l-1.844 4zm-5-17h-2v2.542h2v-2.542zm-4.793 3.418l-2.156-2.156-1.414 1.414 2.156 2.156 1.414-1.414zm10.875-.981l-1.414-1.414-2.114 2.114 1.414 1.414 2.114-2.114zm-13.686 4.563h-2.396v2h2.396v-2zm-1.626 6.848l1.303 1.517 2.199-1.919-1.303-1.517-2.199 1.919zm19.652-3.332c-.169-3.073-2.75-5.516-5.922-5.516-.736 0-1.438.137-2.086.377-.891-.849-2.086-1.377-3.414-1.377-2.762 0-5 2.238-5 5 0 1.429.609 2.702 1.574 3.608-.363.624-.574 1.343-.574 2.114 0 2.36 1.945 4.273 4.348 4.277l.892-1.999h-.886c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.146-.881 2.087-2.02 2.245l-1.711 2.033h1.377c2.405 0 4.354-1.916 4.354-4.278 0-2.101-1.545-3.847-3.578-4.206zm-11.844 0c-.594.105-1.139.34-1.623.656-.585-.544-.955-1.312-.955-2.172 0-1.654 1.346-3 3-3 .582 0 1.113.182 1.572.47-1.15 1.004-1.905 2.436-1.994 4.046z"/></svg>`
  //     );
  //   }
  // }

  conditionMarkup() {
    //forse la levo la probabilità di pioggia
    const condition = this.weathercode;
    const test = condition.map((e) => {
      if (e >= 0 && e <= 3) {
        return `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="day-icon"
          >
            <path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm2.312-4.897c0 2.206 1.794 4 4 4s4-1.794 4-4-1.794-4-4-4-4 1.794-4 4zm10 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" />
          </svg>`;
      }
      //Nebbia
      if (e >= 45 && e <= 48) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="day-icon"><path d="M20.422 8.516c-.178-3.232-3.031-5.777-6.432-5.491-1.087-1.24-2.693-2.025-4.49-2.025-3.172 0-5.754 2.443-5.922 5.516-2.033.359-3.578 2.105-3.578 4.206 0 2.362 1.949 4.278 4.354 4.278h1.326c.771 1.198 2.124 2 3.674 2h10.291c2.406 0 4.355-1.916 4.355-4.278 0-2.101-1.545-3.847-3.578-4.206zm-15.395 4.484h-.673c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209.967 0 1.714.25 2.29.645-1.823.921-3.096 2.745-3.212 4.871-2.022.357-3.697 2.127-3.551 4.484zm14.618 2h-10.291c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.257-1.057 2.278-2.355 2.278zm4.355 5h-19v-2h19v2zm0 3h-19v-2h19v2z"/></svg>`;
      }

      //PIOGGIA
      if (e >= 51 && e <= 67) {
        return `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      class="day-icon"
    >
      <path
        d="M20.422 7.516c-.178-3.233-3.031-5.778-6.432-5.492-1.087-1.239-2.693-2.024-4.49-2.024-3.172 0-5.754 2.443-5.922 5.516-2.033.359-3.578 2.105-3.578 4.206 0 2.362 1.949 4.278 4.354 4.278h1.326c.771 1.198 2.124 2 3.674 2h10.291c2.406 0 4.355-1.916 4.355-4.278 0-2.101-1.545-3.847-3.578-4.206zm-15.395 4.484h-.673c-1.297 0-2.354-1.022-2.354-2.278 0-2.118 2.104-2.597 3.488-2.512-.05-1.356.137-5.21 4.012-5.21.967 0 1.714.25 2.29.644-1.823.922-3.096 2.746-3.212 4.872-2.022.358-3.697 2.127-3.551 4.484zm14.618 2h-10.291c-1.297 0-2.354-1.022-2.354-2.278 0-2.118 2.104-2.597 3.488-2.512-.05-1.356.137-5.21 4.012-5.21 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.256-1.057 2.278-2.355 2.278zm-12.776 6.713l-1.41-1.41 2.303-2.303 1.41 1.41-2.303 2.303zm-3.3 3.287l-1.41-1.397 2.303-2.303 1.41 1.41-2.303 2.29zm8.253-3.287l-1.41-1.41 2.303-2.303 1.41 1.41-2.303 2.303zm-3.3 3.287l-1.41-1.397 2.303-2.303 1.41 1.41-2.303 2.29zm8.175-3.287l-1.41-1.41 2.303-2.303 1.41 1.41-2.303 2.303zm-3.301 3.287l-1.41-1.397 2.303-2.303 1.41 1.41-2.303 2.29z"
      />
    </svg>`;
      }

      //Neve
      if (e >= 71 && e <= 77) {
        return `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="day-icon"
      >
        <path
          d="M20.422 8.516c-.178-3.232-3.031-5.777-6.432-5.491-1.087-1.24-2.693-2.025-4.49-2.025-3.172 0-5.754 2.443-5.922 5.516-2.033.359-3.578 2.105-3.578 4.206 0 2.362 1.949 4.278 4.354 4.278h1.326c.771 1.198 2.124 2 3.674 2h10.291c2.406 0 4.355-1.916 4.355-4.278 0-2.101-1.545-3.847-3.578-4.206zm-15.395 4.484h-.673c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209.967 0 1.714.25 2.29.645-1.823.921-3.096 2.745-3.212 4.871-2.022.357-3.697 2.127-3.551 4.484zm14.618 2h-10.291c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.257-1.057 2.278-2.355 2.278zm2.105 4.25c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm-4 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm-4 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm-4 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm2 2.5c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm4.094 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25zm3.906 0c0 .689-.559 1.25-1.25 1.25s-1.25-.561-1.25-1.25.559-1.25 1.25-1.25 1.25.561 1.25 1.25z"
        />
      </svg>`;
      }

      //Temporali
      if (e >= 80 && e <= 99) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="day-icon"><path d="M15 17h3l-6 7 2-5h-3l2.802-6h3.042l-1.844 4zm-5-17h-2v2.542h2v-2.542zm-4.793 3.418l-2.156-2.156-1.414 1.414 2.156 2.156 1.414-1.414zm10.875-.981l-1.414-1.414-2.114 2.114 1.414 1.414 2.114-2.114zm-13.686 4.563h-2.396v2h2.396v-2zm-1.626 6.848l1.303 1.517 2.199-1.919-1.303-1.517-2.199 1.919zm19.652-3.332c-.169-3.073-2.75-5.516-5.922-5.516-.736 0-1.438.137-2.086.377-.891-.849-2.086-1.377-3.414-1.377-2.762 0-5 2.238-5 5 0 1.429.609 2.702 1.574 3.608-.363.624-.574 1.343-.574 2.114 0 2.36 1.945 4.273 4.348 4.277l.892-1.999h-.886c-1.297 0-2.354-1.021-2.354-2.278 0-2.118 2.104-2.597 3.488-2.513-.05-1.355.137-5.209 4.012-5.209 3.771 0 4.229 3.771 4.012 5.209 1.509-.105 3.488.437 3.488 2.513 0 1.146-.881 2.087-2.02 2.245l-1.711 2.033h1.377c2.405 0 4.354-1.916 4.354-4.278 0-2.101-1.545-3.847-3.578-4.206zm-11.844 0c-.594.105-1.139.34-1.623.656-.585-.544-.955-1.312-.955-2.172 0-1.654 1.346-3 3-3 .582 0 1.113.182 1.572.47-1.15 1.004-1.905 2.436-1.994 4.046z"/></svg>`;
      }
    });
    dayIcon.forEach((e, i) => {
      if (i < test.length) {
        e.insertAdjacentHTML("afterbegin", test[i]);
      }
      this.nextSVG(e, test, "conditionIndex");
      this.prevSVG(e, test, "conditionIndex");
    });
  }
}

const app = new App();
