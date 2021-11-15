/*
 * Script to display table from Google Sheets as points using Leaflet
 * The Sheets are then imported using PapaParse and overwrite the initially laded layers
 */

// Add Google Sheets URL

let pointsURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRq35W4ymM2dngELMMGscT6ZRALftOa049JBipA2ZSbLVe7HXLGlByzqFCfs7dqnTs7Sedc9HsdttBJ/pub?output=csv";

window.addEventListener("DOMContentLoaded", init);

let map;

// init() is called when the page has loaded

function init() {

// To fix map issue
//    const mapDiv = document.getElementById("map");
  
    map = L.map('map', {
          center: new L.LatLng(19.409, -154.914),
          zoom: 16,
          attributionControl: false,
//          tap: false,
//          dragging: false,
//          dragging: !L.Browser.mobile,
//          tap: !L.Browser.mobile,
          zoomControl: false
        });  

// To fix map issue
//    const resizeObserver = new ResizeObserver(() => {
//        map.invalidateSize();
//    });

//    resizeObserver.observe(mapDiv);  
  
  L.tileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>",
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);
  
//  L.control.tagFilterButton({
//        data: ['fast', 'slow', 'none'],
//        filterOnEveryClick: true
//  }).addTo(map);
  
  
//  L.easyButton('fa-star', function(){
//    alert('you just clicked the html entity');
//  }).addTo(map);

  
    L.marker([50.521, 30.52], { tags: ['tomato', 'active'] }).addTo(map); 
    L.marker([50.487, 30.54], { tags: ['tomato', 'ended'] }).addTo(map);
    L.marker([50.533, 30.5], { tags: ['tomato', 'ended'] }).addTo(map);
    L.marker([50.54, 30.48], { tags: ['strawberry', 'active'] }).addTo(map);
    L.marker([50.505, 30.46], { tags: ['strawberry', 'ended'] }).addTo(map);
    L.marker([50.5, 30.43], { tags: ['cherry', 'active'] }).addTo(map);
    L.marker([50.48, 30.5], { tags: ['cherry', 'ended'] }).addTo(map);

     var statusFilterButton = L.control.tagFilterButton({
        data: ['active', 'ended'],
      filterOnEveryClick: true,
      icon: '<i class="fa fa-suitcase"></i>',
    }).addTo(map);

    var foodFilterButton = L.control.tagFilterButton({
        data: ['tomato', 'cherry', 'strawberry'],
      filterOnEveryClick: true,
        icon: '<i class="fa fa-pagelines"></i>',
    }).addTo(map);

    foodFilterButton.addToReleated(statusFilterButton);

    jQuery('.easy-button-button').click(function() {
        target = jQuery('.easy-button-button').not(this);
        target.parent().find('.tag-filter-tags-container').css({
            'display' : 'none',
        });
    });
  
  
  
  
  
  
  
  
  
  
  
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
    
    var icon = L.icon({
     iconUrl: data[row].micon,
     iconSize: [24, 24]
    });
    
    marker = L.marker([data[row].lat, data[row].lon], { tags:[data[row].speed], icon: icon});

    marker.addTo(pointGroupLayer);
//    marker.on('click', markerOnClick);
    marker.addTo(map);

    marker.bindPopup('<p>' + data[row].name + '<p>');

    marker.feature = {
      properties: {
        name: data[row].name,
        description: data[row].description,
      },
    };

//    function markerOnClick(e)
//      {
//        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Hawaiian Name:</th><td>" + this.options.hname + "</td></tr>" + "<tr><th>Canoe Plant:</th><td>" + this.options.cplant + "</td></tr>" + "<tr><th>Description:</th><td>" + this.options.descript + "</td></tr>" + "<tr><th>Harvest:</th><td>" + this.options.harvest + "</td></tr>" + "<table>";
//        $("#feature-title").html(this.feature.properties.name);
//        $("#feature-info").html(this.feature.properties.description);
//        $("#bottom_modal").modal("show");	  
//            var bgimgurlm = 'url(' + this.options.bimage + ')';
//            var divm = document.getElementById("bgimage");
//            divm.style.backgroundImage = bgimgurlm;
//            divm.style.backgroundRepeat = "no-repeat";
//            divm.style.backgroundSize = "contain";  
//      }    
    
    
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


