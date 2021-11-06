/*
 * Script to display table from Google Sheets as points using Leaflet
 * The Sheets are then imported using PapaParse and overwrite the initially laded layers
 */

// Add Google Sheets URL

let pointsURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRq35W4ymM2dngELMMGscT6ZRALftOa049JBipA2ZSbLVe7HXLGlByzqFCfs7dqnTs7Sedc9HsdttBJ/pub?output=csv";

window.addEventListener("DOMContentLoaded", init);

let map;

/*
 * init() is called when the page has loaded
 */

function init() {
  
// Create a new Leaflet map and add a baselayer

//To fix map issue
    const mapDiv = document.getElementById("map");
  
//  map = L.map("map").setView([19.409, -154.914], 17).attributionControl: false.zoomControl: false;
    map = L.map('map', {
          center: new L.LatLng(19.409, -154.914),
          zoom: 16,
          attributionControl: false,
          zoomControl: false
        });  

//To fix map issue
    const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
    });

    resizeObserver.observe(mapDiv);  
  
  L.tileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>",
      subdomains: "abcd",
      maxZoom: 44,
    }
  ).addTo(map);


// Use PapaParse to load data from Google Sheets

  Papa.parse(pointsURL, {
    download: true,
    header: true,
    complete: addPoints,
  });
}

//Add all the points to a single Layer Group and to the map

function addPoints(data) {
  data = data.data;
  let pointGroupLayer = L.layerGroup().addTo(map);

  for (let row = 0; row < data.length; row++) {
    let marker;

    marker = L.marker([data[row].lat, data[row].lon]);

    marker.addTo(pointGroupLayer);
    marker.addTo(map);

    marker.bindPopup('<h2>' + data[row].name + '</h2>Theres a ' + data[row].description + ' here');

    marker.feature = {
      properties: {
        name: data[row].name,
        description: data[row].description,
      },
    };

//    marker.on({
//      click: function (e) {
//        L.DomEvent.stopPropagation(e);
//        document.getElementById("sidebar-title").innerHTML =
//          e.target.feature.properties.name;
//        document.getElementById("sidebar-content").innerHTML =
//          e.target.feature.properties.description;
//        sidebar.open(panelID);
//      },
//    });

  }
}
