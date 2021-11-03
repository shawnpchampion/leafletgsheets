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

  map = L.map("map").setView([19.409, -154.914], 17);

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

//Add all the points to a single Layer Group

function addPoints(data) {
  data = data.data;
  let pointGroupLayer = L.layerGroup().addTo(map);

  // Choose marker type. Options are:
  // (these are case-sensitive, defaults to marker!)
  // marker: standard point with an icon
  // circleMarker: a circle with a radius set in pixels
  // circle: a circle with a radius set in meters
//  let markerType = "marker";

  // Marker radius
  // Wil be in pixels for circleMarker, metres for circle
  // Ignore for point
//  let markerRadius = 100;

  for (let row = 0; row < data.length; row++) {
    let marker;
//    if (markerType == "circleMarker") {
//      marker = L.circleMarker([data[row].lat, data[row].lon], {
//        radius: markerRadius,
//      });
//    } else if (markerType == "circle") {
//      marker = L.circle([data[row].lat, data[row].lon], {
//        radius: markerRadius,
//      });
//    } else {
      marker = L.marker([data[row].lat, data[row].lon]);
    }
    marker.addTo(pointGroupLayer);
    marker.addTo(map);

// UNCOMMENT THIS LINE TO USE POPUPS
//    marker.bindPopup('<h2>' + data[row].name + '</h2>There's a ' + data[row].description + ' here');

    // COMMENT THE NEXT GROUP OF LINES TO DISABLE SIDEBAR FOR THE MARKERS
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

/*
 * Accepts any GeoJSON-ish object and returns an Array of
 * GeoJSON Features. Attempts to guess the geometry type
 * when a bare coordinates Array is supplied.
 */
function parseGeom(gj) {
  // FeatureCollection
  if (gj.type == "FeatureCollection") {
    return gj.features;
  }

  // Feature
  else if (gj.type == "Feature") {
    return [gj];
  }

  // Geometry
  else if ("type" in gj) {
    return [{ type: "Feature", geometry: gj }];
  }

  // Coordinates
  else {
    let type;
    if (typeof gj[0] == "number") {
      type = "Point";
    } else if (typeof gj[0][0] == "number") {
      type = "LineString";
    } else if (typeof gj[0][0][0] == "number") {
      type = "Polygon";
    } else {
      type = "MultiPolygon";
    }
    return [{ type: "Feature", geometry: { type: type, coordinates: gj } }];
  }
}
