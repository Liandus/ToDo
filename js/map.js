import {placeInfoLoad} from './server.js';
import {getRightDistance} from './utils/metersToKilometers.js';
const searchInputEl = document.querySelector('#destination');
const searchPlaceEl = document.querySelector('#search');
const deletePinsEl = document.querySelector('#delete-pins');
const distanceEl = document.querySelector('#distance');
const mapContainer = document.querySelector('.vacation-holiday__map');
const MAP_INITIAL_LAT = 55.751999;
const MAP_INITIAL_LNG = 37.617734;
const MAP_INITIAL_ZOOM = 10;
const MAIN_ICON_SIZES = [40, 40];
const MAIN_ICON_ANCHOR_SIZES = [20, 40];
const ROUT_ICON_SIZES = [25, 41];
const ROUT_ICON_ANCHOR_SIZES = [12.5, 41];

const map = L.map(mapContainer)
  .setView({
    lat: MAP_INITIAL_LAT,
    lng: MAP_INITIAL_LNG,
  }, MAP_INITIAL_ZOOM);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },).addTo(map);

const routPinIcon = L.icon({
  iconUrl: 'images/marker-icon.png',
  iconSize: ROUT_ICON_SIZES,
  iconAnchor: ROUT_ICON_ANCHOR_SIZES,
});

/*function addLayer() {
  return L.geoJson(campus, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}
let layer = addLayer()

function redrawLayer(){
  map.removeLayer(layer)
  layer = addLayer()
}*/

const createLayer = () => {
  return L.layerGroup().addTo(map)
}

let layer = createLayer();

//const markerGroup = L.layerGroup().addTo(map);

const createRoutePoint = (pointLat, pointLng) => {
  const routMarker = L.marker(
    {
      lat: pointLat,
      lng: pointLng,
    },
    {
      draggable: true,
      icon: routPinIcon,
    },
  );
  
  routMarker.addTo(layer);
};

const onDeletePinsClick = () => {
  map.removeLayer(layer);
  layer = createLayer();
  distanceEl.textContent = '';
  console.log(latlngs);
  latlngs = [];
  console.log(latlngs);
  //todo очищать данные
  //dellMapClick();
}

deletePinsEl.addEventListener('click', onDeletePinsClick)

let latlngs = [];

const getDistance = () => {
  const coordinats = latlngs;
  if (coordinats.length > 1) {
    let distances = []; 
    coordinats.map((point, index, arr) => {
        if (index === (arr.length - 1)) {
          return;
        } else {
          let currentResult = map.distance(point, arr[index + 1]);
          distances.push(currentResult);
      }
    })
    let sumDistance = distances.reduce((a, b) =>  a + b);
    distanceEl.textContent = getRightDistance(sumDistance);
  }
};

const onMapClick = (evt) => {
  const clickPromise = new Promise((resolve) => {
    resolve(evt.latlng)
  });
  clickPromise.then((coordinats) => createRoutePoint(coordinats.lat, coordinats.lng));
  clickPromise.then((coordinats) => {
    latlngs.push(coordinats);
    L.polyline(latlngs, {color: 'red'}).addTo(layer);
  });
  clickPromise.then(() => getDistance());
};

const callMapClick = () => map.on('click', onMapClick);
const dellMapClick = () => map.off('click', onMapClick);

const onCreateHandleRouteClick = () => {
  callMapClick();
}

const mainPinIcon = L.icon({
  iconUrl: 'images/main-pin.svg',
  iconSize: MAIN_ICON_SIZES,
  iconAnchor: MAIN_ICON_ANCHOR_SIZES,
});

const mainMarker = L.marker(
  {
    lat: MAP_INITIAL_LAT,
    lng: MAP_INITIAL_LNG,
  },
  {
    draggable: false,
    icon: mainPinIcon,
  },
);
  
mainMarker.addTo(map);

const getCoordinates = (pointData) => {
  const point = [];
  point.push(pointData.lat);
  point.push(pointData.lon);
  return point;
};

const infoAboutPlace = {
  cityName: '',
  lat:'',
  lon:'',
};

const onSearchClick = async () => {
  const result = searchInputEl.value;
  if (result) {
    const response = await placeInfoLoad(result);
  map.flyTo(getCoordinates(response), MAP_INITIAL_ZOOM)
  mainMarker.setLatLng(getCoordinates(response));
  infoAboutPlace.cityName = response.display_name;
  infoAboutPlace.lat = response.lat;
  infoAboutPlace.lon = response.lon;
  return infoAboutPlace;
  }
  return;
};

searchPlaceEl.addEventListener('click', onSearchClick);

export {infoAboutPlace, searchInputEl, searchPlaceEl , onCreateHandleRouteClick};