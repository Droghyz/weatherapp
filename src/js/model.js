import "core-js/stable";
import "regenerator-runtime/runtime.js";
import * as leaflet from "./../../node_modules/leaflet/dist/leaflet.js";

// export const getPosition = async function () {
//   try {
//     const pos = function (position) {
//       const lat = position.coords.latitude;
//       const lon = position.coords.longitude;
//       getMeteo(lat, lon);
//     };
//     navigator.geolocation.getCurrentPosition(pos);
//   } catch (err) {
//     console.error(err);
//   }
// };

// class Test{

//   _getPosition(){
//     if(navigator.geolocation)
//       navigator.geolocation.getCurrentPosition(this._getMeteo.bind(this) , function(){
//         console.error('Unable to get position');
//       })
//   }

//   _getMeteo(position){
//     const lat = position.coords.latitude;
//     const lon = position.coords.longitude;

//   }
// }

export const getPosition = function () {
  navigator.geolocation.getCurrentPosition(function (pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    getMeteo(lat, lon);
  });
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

    //

    console.log(data.daily);
  } catch (err) {
    console.error(err);
  }
};
