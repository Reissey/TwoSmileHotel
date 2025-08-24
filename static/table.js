const nameo=document.getElementById('name');
const num=document.getElementById('num');
const type=document.getElementById('type');
const inn=document.getElementById('inn');
const out=document.getElementById('out');
const stats=document.getElementById('status');
const email=document.getElementById('email');
let star=0;
let cont=5;
let star1=0;
let cont1=5;
let star2=0;
let cont2=5;
let star3=0;
let cont3=5;
let data=[];
let data2=[];
let data3=[];
let data4=[];
const recognize=new webkitSpeechRecognition();
recognize.continuous=true;
recognize.interimResults=true;
recognize.lang='en-US';

recognize.onstart=()=>{
    console.log('Speech recognition on the closing end begins');
}

recognize.onend=()=>{
    console.log('Speech recognition ended on the closind end');
    stop()
}

recognize.onerror=(event)=>{
    console.error(`Error in the closing end ${event.error}`);
}

recognize.onspeechend=()=>{
    console.log('Speech ends');
    stop();
}

let trans=''
recognize.onresult=(event)=>{
    trans=Array.from(event.results).map(result=>result[0].transcript).join(' ');
    checkWords(trans);
}

const checkWords=(trans)=>{
    const words=['close','abort'];
    const edit=trans.toLowerCase();
    
       for(let word of words){
        if(edit.includes(word)){
            if(word === 'close' || word === 'abort'){
                return window.location.href='Register.html';
            }
        }
       }
}

const start=()=>{
    recognize.start()
}

const stop=()=>{
    recognize.stop()
}

const availableRooms=async()=>{
try{
    const response=await fetch('/rooms_unbooked');
    if(!response.ok){
       return console.log('Error in fetching unbooked rooms');
    }
    data4=await response.json();
    console.log(data4);
    console.log('sorted')
    displayAvailableRooms()
}catch(err){
    console.error('Error in unbooked',err.stack)
}
    //await displayRooms()
}
availableRooms();

const allRoom= async () => {
    const response=await fetch('/rooms');
    if(response.ok){
        console.log('Correct !')
    }else{
       return console.log("Incorrect")
    }
    data2=await response.json();
    console.log(data2,data2[0].id)
    await displayRooms(data2);
}

 allRoom()    

const unavailableRooms= async () =>{
    const response=await fetch('/rooms_booked');
    if(!response.ok){
        console.error("Error ")
    }
     data=await response.json();
     displayInfives();
}

 unavailableRooms();

    let displayRooms = async (data2) => {
        const tableBody = document.getElementById('allRooms');
        tableBody.innerHTML = '';
        const item=data2.slice(star,star+cont)
        item.forEach(room => {        
        const row = document.createElement('tr');
        const nameID=document.createElement('td');
        nameID.textContent=room.customer_name
        const nameCell = document.createElement('td');

        nameCell.textContent = room.id;
        const typeCell = document.createElement('td');
        typeCell.textContent = room.room_type;

        const numCell = document.createElement('td');
        numCell.textContent = room.room_number;

        const statusCell = document.createElement('td');
        statusCell.textContent = room.available;
        row.appendChild(nameID)
        row.appendChild(nameCell);
        row.appendChild(typeCell);
        row.appendChild(numCell);
        row.appendChild(statusCell);

        tableBody.appendChild(row);
    });
}
    

let displayAvailableRooms=()=>{
    const avai=document.getElementById('availableRooms');
    avai.textContent='';
    const items=data4.slice(star3,star3+cont3);
    items.forEach(item=>{
        const tabRow=document.createElement('tr');
        const tName=document.createElement('td');
        tName.textContent=item.customer_name;
        const tDataID=document.createElement('td');
        tDataID.textContent=item.id;
        const tDataR=document.createElement('td');
        tDataR.textContent=item.room_type;
        const tDataN=document.createElement('td');
        tDataN.textContent=item.room_number
        const tDataA=document.createElement('td');
        tDataA.textContent=item.available
        tabRow.appendChild(tName);
        tabRow.appendChild(tDataID);
        tabRow.appendChild(tDataR);
        tabRow.appendChild(tDataN);
        tabRow.appendChild(tDataA);
        avai.appendChild(tabRow);
    })
}
let displayInfives=()=>{
    const tab=document.getElementById('tableBody')
    
    const item=data.slice(star1,star1+cont1);
    tab.textContent=''
    item.forEach(item=>{       
    const tableRow=document.createElement('tr');
    const tName=document.createElement('td');
    tName.textContent=item.customer_name;

    const customer=document.createElement('td');
    customer.textContent=item.id;
    
    const roomType=document.createElement('td');
    roomType.textContent=item.room_type;
    
    const roomNo=document.createElement('td');
    roomNo.textContent=item.room_number;
    
    const stats=document.createElement('td');
    stats.textContent=item.available
    
    tableRow.appendChild(tName);
    tableRow.appendChild(customer);
    tableRow.appendChild(roomType);
    tableRow.appendChild(roomNo);
    tableRow.appendChild(stats);
    tab.appendChild(tableRow);
        })
    }

const nextPage = () => {
    if ((star1 + cont1) < data.length) {
        star1 += cont1;
        displayInfives();
    }
};

const prevPage = () => {
    if (star1 >= cont1) {
        star1 -= cont1;
    } else {
        star1 = 0;
    }
    displayInfives();
    console.log('Firing in prev page')
};

const nextPage2 =async () => {
    if ((star + cont) < data.length) {
        star += cont;
       await displayRooms(data2);
        console.log('fire')
    }
};

const prevPage2 = async () => {
    if (star >= cont) {
        star -= cont;
    } else {
        star = 0;
    }
   await displayRooms(data2);
   console.log('Firing in prev page')
};

let displayUnbooked=()=>{
    const tableUnbooked=document.getElementById('tableUnbooked');
    tableUnbooked.innerHTML=' '
    const item=data3.slice(star2,star2+cont2);
    item.forEach(unbooked=>{
        const tr=document.createElement('tr');
        const tName=document.createElement('td');
        tName.textContent=unbooked.customer_name;
        const cus_ID=document.createElement('td');
        cus_ID.textContent=unbooked.id;
        const roomT=document.createElement('td');
        roomT.textContent=unbooked.room_type;
        const roomN=document.createElement('td');
        roomN.textContent=unbooked.room_number;
        const ava=document.createElement('td');
        ava.textContent=unbooked.available;
        tr.appendChild(tName);
        tr.appendChild(cus_ID);
        tr.appendChild(roomT);
        tr.appendChild(roomN);
        tr.appendChild(ava);
        tableUnbooked.appendChild(tr);
    })
}

const nextPage3 =async () => {
    if ((star2 + cont2) < data.length) {
        star2 += cont2;
        displayUnbooked();
        console.log('fire')
    }
};

const prevPage3 = async () => {
    if (star2 >= cont2) {
        star2 -= cont2;
    } else {
        star2 = 0;
    }
     displayUnbooked();
   console.log('Firing in prev page')
};

const nextPage4=async()=>{
    if ((star3 + cont3) < data.length) {
        star3 += cont3;
        displayAvailableRooms();
        console.log('fire')
    }
}
const prevPage4=async()=>{
    if (star3 >= cont3) {
        star3 -= cont3;
    } else {
        star3 = 0;
    }
     displayAvailableRooms();
   console.log('Firing in prev page')
}
const next4=document.getElementById('next4');
const prev4=document.getElementById('prev4');
next4.addEventListener('click',nextPage4);
prev4.addEventListener('click',prevPage4);
let next3=document.getElementById('next2');
next3.addEventListener('click',nextPage3);
let prev3=document.getElementById('prev2');
prev3.addEventListener('click',prevPage3);
let next2=document.getElementById('next2');
next2.addEventListener('click',nextPage2);

let prev2=document.getElementById('prev2');
prev2.addEventListener('click',prevPage2)

let prev=document.getElementById('prev');
prev.addEventListener('click',prevPage);

let next=document.getElementById('next');
next.addEventListener('click',nextPage);

const choice=document.getElementById('choice')
    console.log('Not forgotten!',choice);

choice.addEventListener('change',(e)=>{
    selVal=e.target.value;
    if(selVal === 'logout'){
        console.log('Logout successful');
        window.location.href='./verify.html';
    }else if(selVal === 'voice'){
        console.log('Voice working');
        start()
    }else{
        console.log('Functions consumed')
    }
})

//window.weeklyGuestsChart=null
const loadChart=async()=>{
const response = await fetch('/api/weekly-guests');
const datas = await response.json();
const labels = datas.map(entry => entry.day);
const guestCounts = datas.map(entry => entry.guest_count);
console.log(labels,guestCounts, datas)
const ctx = document.getElementById('sales').getContext('2d');
if (window.weeklyGuestsChart) {
    window.weeklyGuestsChart.destroy();
}
window.weeklyGuestsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Number of Guests',
            data: guestCounts, 
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            borderColor: 'rgba(75, 192, 192, 1)', 
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Guests'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Day of the Week'
                }
            }
        }
    }
});
}
if (window.weeklyGuestsChart) {
    window.weeklyGuestsChart.destroy();
}

window.onload=loadChart;

const sach=document.getElementById('sach');
sach.addEventListener('submit',async (e)=>{
    e.preventDefault();
    //const roomT=document.getElementById('roomType').value
    //const roomNo=document.getElementById('roomNo').value
    let eemail=document.getElementById('Eemail').value
    let phone=document.getElementById('phony').value
    const response=await fetch('/data',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            //rT:roomT,
            //rN:roomNo,
            eemail:eemail,
            phone:phone
        })
    });
    if(!response.ok){
        console.error('Search data not returned properly')
    }
    let res;
    res=await response.json();
    const dis=document.getElementById('dis');
    console.log('I am working')
    console.log(res);
    dis.innerHTML=` <label >Name: <span id='ert'>${res.tipp.customer_name}</span></label>
    <label >Email: <span id='ert'>${res.tip.email}</span></label> 
    <label >Days: <span id='ert'> ${res.tip.days}</span></label>
    <label >Phone number: <span id='ert'> ${res.tip.phone_numbers}</span></label> 
    <label >Room Type: <span id='ert'> ${res.tip.room_type}</span></label>
    <label >Check In: <span id='ert'> ${res.tipp.check_in}</span></label>
    <label >Check Out: <span id='ert'> ${res.tipp.check_out}</span></label>
    <label >Number of rooms:  <span id='ert'>${res.tipp.no_of_rooms}</span></label>
    <label >Payment Status: <span id='ert'>${res.tipp.payment_status}</span> </label> 
    <label >Points: <span id='ert'> ${res.tipp.points}</span></label>
    `
    setTimeout(()=>{
        dis.innerHTML=``
    },5000);
    let hasData=false;
    if(res.error){
        dis.textContent=res.error
    }
})
/**
 * if(res.tip && res.tip.length > 0){
    hasData=true;
    let data=[];
    data=res.tip;
    data.forEach(rew=>{
        dis.innerHTML+=`<strong>ID:</strong> <span>${rew.id}</span><br>
        <strong>Room Type:</strong><span>${rew.room_type}</span><br>
        <strong>Days Booked:</strong><span>${rew.days}</span>
        `
    })
    eemail.innerHTML='';
    phone.innerHTML='';
} 
if(res.tipp && res.tipp.length > 0){
    hasData=true;
        let dat=[];
        dat=res.tipp;
        dat.forEach(nam=>{
            dis.innerHTML+=`
                <br><strong>Customer Name:</strong><span>${nam.customer_name}</span><br>
                <strong>Payment Status:</strong><span id='tp'>${nam.payment_status || 'N/A'}</span><br> 
                <strong>Check in:</strong> <span>${nam.check_in}</span><br>
                <strong>Check out:</strong><span>${nam.check_out}</span><br>
                <strong>Number Of Rooms:</strong> <span>${nam.no_of_rooms}</span><br>
                <strong>Email:</strong> <span>${nam.email}</span>
                <strong>Extras:</strong><span>${nam.extras}</span>
                `
        })
        eemail.innerHTML=''
        phone.innerHTML=''
    }
    if(!hasData){
    dis.innerHTML=''
    dis.innerHTML='<p id="no">No data available for the info provided</p>'
    }

 */