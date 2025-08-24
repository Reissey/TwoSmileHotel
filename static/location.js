
let lati;
let long;
let routeControl=null 
let watch;
let selectedMode = 'foot';  
        
const showLocation = document.getElementById('Show Location');
const transportSelect = document.getElementById('transport');
const maop = document.getElementById('show');
const hotelLat = 4.9796
const hotelLon = 8.3374;

document.addEventListener('DOMContentLoaded',()=>{
    
const map = L.map('map').setView([7.7345, 8.6120], 13);  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const toRad = (value) => value * Math.PI / 180;  

const success = (position) => {
    const { latitude, longitude } = position.coords;
    showLocation.textContent = `Latitude ${latitude} Longitude ${longitude}.`;
    console.log(`Latitude: ${latitude} Longitude: ${longitude}`);
    lati = latitude;
    long = longitude;
    map.fitBounds([
  [lati, long],
  [hotelLat, hotelLon]
]);
    geofence.center = { lat: lati, lon: long };
    const markr = L.marker([geofence.center.lat, geofence.center.lon]).addTo(map).bindPopup('<strong>Your location</strong>').openPopup();
const marker=L.circle([lati,long],
    {
        radius:500,
        fillColor:'blue',
        fillOpacity:0.5
    }
).addTo(map)
    check(position);  
    checkTime()
};
const mapp=document.getElementById('map');

function checkTime(){
    if(routeControl){
        map.removeLayer(routeControl)
    }
    routeControl=null;
}

const failure = (error) => {
    switch (error.code) {
        case error.UNKNOWN_ERROR:
            showLocation.textContent = `Unknown error`;
            break;
        case error.TIMEOUT:
            showLocation.textContent = `Timeout loading data ...`;
            break;
        default:
            showLocation.textContent = `Error in location service`;
    }
};

maop.addEventListener('click', () => {
    watch = navigator.geolocation.watchPosition(success, failure, {
        maximumAge: 0,
        enableHighAccuracy: true,
        timeout: 5000
    });
});

let geofence = {
    radius: 1000,
    center: { lat: lati, lon: long }
};

function haverSine(position) {
    let { latitude, longitude } = position.coords;
    let { center } = geofence;

    if (!center.lat || !center.lon) {
        return;
    }

    let { lat, lon } = center;
    let lat1 = toRad(latitude);
    let lon1 = toRad(longitude);
    let lat2 = toRad(lat);
    let lon2 = toRad(lon);

    let dlat = lat2 - lat1;
    let dlon = lon2 - lon1;

    let radius = 6371e3;  

    let a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dlon / 2) * Math.sin(dlon / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;  
}

function check(position) {
    let dest = haverSine(position);  
        if (dest && dest === geofence.radius) {
        navigator.geolocation.clearWatch(watch);
        showLocation.textContent = `You have reached your location`;
        speakInstruction('You have reached your destination!')
    } else {
        showLocation.textContent = `Still ongoing for location`;
    }
}

let markerControl = [];
const hotelMarker = L.marker([hotelLat, hotelLon]).addTo(map).bindPopup('<strong>Hotel Destination</strong><br><em>Welcome to Hotel Ballocoona</em><br>');
const hotelOwn=L.circle([hotelLat,hotelLon],{
    color:'orange',
    radius:500,
    fillColor:'green',
    fillOpacity:0.5
}).addTo(map)
routeControl = null;

function speakInstruction(talk){
    const speak=new SpeechSynthesisUtterance(talk)
    window.speechSynthesis.speak(speak)
    speak.onend=()=>{
        continueTalking.style.display='block';
        stop.style.display='none';
    }
}

const stop=document.getElementById('Stop');
let instructions=[];
let insTxt;
const continueTalking=document.getElementById('Cont');

function movementUpdate(selectedMode) {
    if (routeControl) {
        map.removeLayer(routeControl); 
        routeControl = null;
    }

    if (markerControl.length > 0) {
        markerControl.forEach(marker => map.removeLayer(marker));
        markerControl = []; 
    }

    const graphHopperAPIKey = '1def25e7-b40c-4ecd-bb20-1b59b9dfa236';
    const url = `https://graphhopper.com/api/1/route?point=${lati},${long}&point=${hotelLat},${hotelLon}&vehicle=${selectedMode}&key=${graphHopperAPIKey}&instructions=true&locale=en&points_encoded=false`;    

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.paths && data.paths.length > 0) {
                const route = data.paths[0];  
                const time = route.time / 1000;  
                const hours = Math.floor(time / 3600);
                const minutes = Math.floor((time % 3600) / 60);
                instructions=data.paths[0].instructions
                instructions.forEach(ins=>{
                insTxt=ins.text;
                    speakInstruction(insTxt)
                    stop.style.display='block';
                    continueTalking.style.display='none';
                })
                
                let routeColor;
                switch (selectedMode) {
                    case 'car':
                        routeColor = 'green';
                        break;
                    case 'bike':
                        routeColor = 'red';
                        break;
                    case 'foot':
                        routeColor = 'purple';
                        break;
                    default:
                        routeColor = 'green';
                }

                const latLngs = route.points.coordinates.map(coord => [coord[1], coord[0]]);
        
                routeControl = L.Routing.control({
                    waypoints: latLngs.map(latLng => L.latLng(latLng)),
                    routeWhileDragging: true,
                    lineOptions: {
                        styles: [{ color: routeColor, weight: 5 }]
                    },
                    createRouteMarker: function () { return null; },
                }).addTo(map);

                const display = document.getElementById('display_data');
                display.textContent = `Estimated time by ${selectedMode} is ${hours} hour and ${minutes} minute`;
                if (hours && minutes > 1) {
                    let se = 's';
                    display.textContent = `Estimated time by ${selectedMode} is ${hours} hour${se} and ${minutes} minute${se}`;
                } else {
                    display.textContent = `Estimated time by ${selectedMode} is ${hours} hour and ${minutes} minute`;
                }
             } 
             else {
                display.textContent=`No routes found`
             }
        })
        .catch(error => {
            console.error('Error fetching route from GraphHopper:', error);
            alert('Failed to fetch route data.' + error);

        });
}

transportSelect.addEventListener('change', function (event) {
    selectedMode = event.target.value;
    movementUpdate(selectedMode);
    checkTime()
});

maop.addEventListener('click', () => {
    if (lati && long) {
        checkTime();
        movementUpdate(selectedMode);
        console.log('Distance variation working.');
    } else {
        showLocation.textContent = `Error finding location.`;
    }
});

stop.addEventListener('click',()=>{
    window.speechSynthesis.pause()
    continueTalking.style.display='block'
    stop.style.display='none'
})

function continueSpeaking(){
    window.speechSynthesis.resume()
    speakInstruction(insTxt)
    continueTalking.style.display='none';
    stop.style.display='block';
}
 continueTalking.addEventListener('click',continueSpeaking); 

/*
function encryption(){
    const letters='abcdefghijklmnopqrstuvwxyz';
    const wordToChange='properly';
    const index=letters.indexOf(letters);
    const value=index+1;
    const word=wordToChange.indexOf(wordToChange) + value;
    const add=wordToChange[word];
    console.log(add);

    wordToChange.split('').forEach((letters,position)=>{
        const val=letters.indexOf(letters) + 3;
        const addo=wordToChange[val];
        console.log(addo);
        
    })
}
    */
})