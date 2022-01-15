const API_KEY = '5ecb0dc184c9aa594061205b396399d9';

const placeInfoLoad = async (query) => {

  return await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
          method: 'GET',
      },
  )
      .then((response) => {
          if (response.ok) {
              return response.json();
          }
      })
      .then((data) => {
          return data[0];
      });
};

const weatherLoad = (lat, lon, workWithResponse) => {
  fetch(
    
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${API_KEY}`,
    {
      method: 'GET',
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((response) => {
      workWithResponse(response);
    })
    
};

const routLoad = async (coordinates) => {
   return await fetch(
        `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`,
        {
            method: 'GET',
        },
    )
       .then(response => response.json())
       .then(response => response)
};

const rout = routLoad();
console.log(rout);

export {placeInfoLoad, weatherLoad};