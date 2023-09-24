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

# 23/09/23 (night shift):

- Abstracted nextPage and prevPage function
- BUG: Se la funzione nextPage e prevPage viene assegnata a più elementi, ad ogni click l'index viene aggiornato più di una volta

# 22/09/23 (night shift):

- Added card and buttons for switching
- Added logic for switching days
- Added new information (winds speec + direction)
- Added new informnation (probability Rain)

# 19/09/23:

- New Temp Min Color
- Push new version
- A new UI is in developing... created a new UI branch

# 18/09/23:

- Create new testing branch
- Create new card
- Adding temp min
- Adding new background + colors
- Added footer with copyright

# 04/09/23:

- Modify CSS and HTML for better visualization on Mobile.
- First push on Netlify
- Fixed problems on package.json

# 03/09/23 :

- Added lat and lon variable in global scope.
- Restructured code and functions.
- Finish updating the DOM with information from API's

# 01/09/23 :

- Fixed readme with cascading days.
- Restructuring code from MVC into single file.
- Fixed dates on DOM with new dates.

# 30/08/23 :

- Added API call for reverse-geolocalization.
- Update the DOM with the name of the city from the new API.

# 19/08/23 :

- Almost fixed Temp and Icons.
- Added row of days.
- Added Map component inside the card.
- Modifyed geolocation API with external function.

# 18/08/23:

- Create basic card for mobile where to display values.

# 16/08/23:

- Added the fetch request for the meteo app and created the essential variables.
- Created variable of DOM on view.js.

# 15/08/2023:

- Initial setup of the project, parcel, tailwindcss, folder structure.
- Added screensize in tailwind config file.
- Added color palette that extends color on Tailwind css.
- Start building frontpage and possible gradient background.
- Added JS Model View Controller.
- Added logic for get latitude and longitude.
