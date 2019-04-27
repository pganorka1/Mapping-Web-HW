var API_KEY = "pk.eyJ1IjoiYW5kcmV3aG9hbmcwOSIsImEiOiJjamt1Zno2ejcwNTFkM3FwZGJrOXk1bWxxIn0.BCVeyxRcjhsbOLVqnx5uTQ";

// Define arrays to hold created city and state markers
var quakeMarkers = [];

// Loop through locations and create city and state markers
// for (var i = 0; i < locations.length; i++) {
//   // Setting the marker radius for the state by passing population into the markerSize function
//   quakeMarkers.push(
//     L.circle(locations[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "white",
//       radius: markerSize(locations[i].feature.properties.mag)
//     })
//   )
//   };
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

var earthquakes = new L.LayerGroup();

// Function that will determine the color of the marker for earthquake magnitude
function chooseColor(magnitude) {
  switch (true) {
  case magnitude <=1:
    return "green";
  case magnitude <=2:
    return "yellowGreen";
  case magnitude <=3:
    return "yellow";
  case magnitude <=4:
    return "orange";
  case magnitude <=5:
    return "orangeRed";
  case magnitude >5:
    return "red";
  default:
    return "black";
  }
}

// Function that will determine the size of the marker for earthquake magnitude
function chooseSize(magnitude) {
  switch (true) {
  case magnitude <=1:
    return "10";
  case magnitude <=2:
    return "15";
  case magnitude <=3:
    return "20";
  case magnitude <=4:
    return "25";
  case magnitude <=5:
    return "30";
  case magnitude >5:
    return "35";
  default:
    return "5";
  }
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Creating a geoJSON layer with the retrieved data
  createFeatures(data);

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  },
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        weight: 1.5,
        radius: chooseSize(feature.properties.mag)
      };
    }
    // onEachFeature: onEachFeature,
  }).addTo(earthquakes);
});

 // Create our map, giving it the streetmap and earthquakes layers to display on load
 var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, earthquakes]
});

var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + features.properties.place +
      "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
 
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}}


function createMap(earthquakes) {

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
// Create legend with loop for colors and magnitude range
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
  var div = L.DomUtil.create('div', 'info legend'); 
  var colors = ["green", "yellowGreen", "yellow", "orange", "orangeRed", "red"];
  var range = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  for (var i = 0; i < range.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '; padding-left:10px;"> </i>' + range[i] + '<br>'
  }
  return div;
}
legend.addTo(myMap);
Collapse




