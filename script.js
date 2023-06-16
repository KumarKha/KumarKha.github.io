const key = 'AIzaSyCdcfXZt13eJPhIAQLN7JetZmuCRMymOgQ';

// HTML Elements
const form = document.querySelector('#form');
const inputA = document.querySelector('#pointA');
const inputB = document.querySelector('#pointB');
const output = document.querySelector('#res');
addressToCoordinates('New York');
function addressToCoordinates(location) {
  axios
    .get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: 'AIzaSyCdcfXZt13eJPhIAQLN7JetZmuCRMymOgQ',
      },
    })
    .then((res) => {
      const coordinateFromGoogle = res.data.results[0].geometry.location;

      console.log(coordinateFromGoogle);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Listener to process input and display distance
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // console.log(handleInput(inputA));

  const pointA = handleInput(inputA);
  const pointB = handleInput(inputB);

  output.innerText = calDistance(pointA, pointB);
});

// Input helper functions

// Separate Input in to part and add reformating to Object
const handleInput = (input) => {
  let arr = input.value.split(',');

  return new Coordinate(arr[0], arr[1]);
};

// Coordinate Object
class Coordinate {
  constructor(lat, long) {
    this.lat = lat;
    this.long = long;
  }
}

/**
 *
 * Haversine
 * formula:	a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
 * c = 2 ⋅ atan2( √a, √(1−a) )
 * d = R ⋅ c
 * R = Earth Radius
 * φ is latitude, λ is longitude, R is earth’s radius (mean radius = * 6,371km);
 * note that angles need to be in radians to pass to trig functions!
 */

const calDistance = (pointA, pointB) => {
  const radius = 6371; //Radius in km

  //Convert Latitude and Longitude from degrees to radians

  pointA.lat = (pointA.lat / 180) * Math.PI;
  pointA.long = (pointA.long / 180) * Math.PI;

  pointB.lat = (pointB.lat / 180) * Math.PI;
  pointB.long = (pointB.long / 180) * Math.PI;

  // Breaking formula into parts

  //let x = sin²(Δφ/2)
  const x = Math.pow(Math.sin((pointB.lat - pointA.lat) / 2), 2);
  //let y = sin²(Δλ/2)
  const y = Math.pow(Math.sin((pointB.long - pointA.long) / 2), 2);

  const a = x + Math.cos(pointA.lat) * Math.cos(pointB.lat) * y;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = c * radius;

  return distance.toFixed(2);
};
// const pointA = { lat: 1, long: 2 };
// const pointB = { lat: 3, long: 4 };
// calDistance(pointA, pointB); // Expected 314
