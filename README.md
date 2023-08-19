# meteo-app

Weathercast app that shows a map of the town

The app will start wih a searchbox, where the user will input their City.
After that with an API call to a Weathercast service, the meteo will shown on the app.
Also, using Leaflet API, there will be a map with position of the user.

User Story:
I want to search for my city
I want to see the meteo condiction for the city i searched
I want to see where i am on a map

---

# 15/08/2023:

- Initial setup of the project, parcel, tailwindcss, folder structure.
- Added screensize in tailwind config file
- Added color palette that extends color on Tailwind css
- Start building frontpage and possible gradient background
- Added JS Model View Controller
- Added logic for get latitude and longitude

# 16/08/23:

- Added the fetch request for the meteo app and created the essential variables.
- Created variable of DOM on view.js.

# 18/08/23:

- Create basic card for mobile where to display values.

# 19/08/23 :

- Almost fixed Temp and Icons
- Added row of days
- Added Map component inside the card
- Modifyed geolocation API with external function
