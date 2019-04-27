// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  //layers: [streetmap, earthquakes]
});

// Perform a GET request to the query URLhttp
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  //convert markers to circles 
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}
L.geoJSON(data, {
  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
  }
})
});
var myStyle = {
  "color": "#ff7800",
  "weight": 5,
  "opacity": 0.65
};

  function mystyle(magnitude) {
    if (magnitude <= 1){
      return "red";
    } 
    else if (magnitude =>1 <2){
      return "green";
    }
  }
  // L.geoJSON(myLines, {
  //     style: myStyle
  // }).addTo(map)
  // .addTo(myMap)
  // .createFeatures(data);

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
// Define arrays to hold created city and state markers
var quakeMarkers = [];

// Loop through locations and create city and state markers
// for (var i = 0; i < earthquakes.feature.geometry.coordinates.length; i++) {
//   // Setting the marker radius for the state by passing population into the markerSize function
//   quakeMarkers.push(
//     L.circle(earthquakes.feature.geomertry.coordinates[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "white",
//       radius: markerSize(earthquakes.feature.geometry.coordinates[i].feature.properties.mag)
//     })
//   )};
function createMap(earthquakes) {

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

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};