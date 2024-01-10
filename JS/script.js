const currentIp = document.querySelector('#ip-number')
const adress = document.querySelector('#location')
const timeOffset = document.querySelector('#time-offset')
const provider = document.querySelector('#isp')
const sendIp = document.getElementById('ip');
const submit = document.getElementById('submit');
let popup = document.getElementById('popup-info');

function startIp(userIp, newDomain){

  const getIp = async () => {
    try{
      const apiAdress = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_dR7YxR8WrSTTKIaAabjwsnqZLZQKA&ipAddress=${userIp}&domain=${newDomain}`)
  
      if(!apiAdress.ok){
        if(apiAdress.status === 400){
          throw new Error ('Data not found');
        } else if(apiAdress.status === 500){
          throw new Error ('problem of server');
        } else {
          throw new Error ('Network response was not ok')
        }
      }
  
      const responseJson = await apiAdress.json();
      const data = responseJson;
      const ipDefault = data.ip;
      const cityDefault = data.location.city;
      const regionDefault = data.location.region;
      const timeZoneDefault = data.location.timezone;
      let latDefault = data.location.lat;
      let lngDefault = data.location.lng;
      const ispDefault = data.isp;

      
      let blackIcon = L.icon({
        iconUrl: 'blackIcon.png',
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
      });
      
      let container = L.map('map').setView([latDefault, lngDefault], 13);
      let marker = L.marker([latDefault, lngDefault], {icon: blackIcon}).addTo(container);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(container);
           
      sendCoordinate(container);

      currentIp.innerText = ipDefault;
      adress.innerText = `${cityDefault}, ${regionDefault}`;
      timeOffset.innerText = `UTC ${timeZoneDefault}`;
      provider.innerText = ispDefault;
    }
  
    catch (e){
      console.error(e)
    }
  }

  getIp()
}

function sendCoordinate(container){
  submit.addEventListener('click', () => {
    if(container !== null){
      container.remove();

      let userValue = sendIp.value;
        
      const trueDomain = /^(?:\*\.)?[a-z0-9]+(?:[\-.][a-z0-9]+)*\.[a-z]{2,6}$/;
      const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/; 
      const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/; 
      if(userValue.match(ipv4Pattern) || userValue.match(ipv6Pattern)){
        let userIp = userValue;
        startIp(userIp, '')
      } else if (userValue.match(trueDomain)) {
        let newDomain = userValue;
        startIp('', newDomain)
      } else{
        startIp('', '')
      }
    }
    
  })
}

startIp('', '');

sendIp.addEventListener('click', () => {
  popup.classList.toggle("opened")
  console.log('ciao')
});