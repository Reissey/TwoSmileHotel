const load=async()=>{
    const email = localStorage.getItem('payEmail') || localStorage.getItem('ono');
    let awd=await fetch(`/getReceipt?email=${email}`);
    let awdRes=await awd.json();
    console.log(awdRes);
    let rec=document.getElementById('receiptDisplay');
    rec.innerHTML=`
    <p>Name:${awdRes.sen.name}</p>
    <p>Email:${awdRes.sen.email}</p>
    <p>PaidAt:${awdRes.sen.paidat}</p>
    <p>Amount:${awdRes.sen.amount}</p>
    <p>Currency:${awdRes.sen.currency}</p>
    <p>Reference:${awdRes.sen.ref}</p>
    `
}
load();
async function calculateTotal() {
  const email = localStorage.getItem('payEmail') || localStorage.getItem('ono');
  const inputs = document.querySelectorAll("#wines input");
  let total = 0;

  inputs.forEach(input => {
    const quantity = parseInt(input.value) || 0;
    const price = parseInt(input.dataset.price);
    total += quantity * price;
  });

  const mealCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  mealCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      total += parseInt(checkbox.value);
    }
  });

  document.getElementById("total").textContent = "Total to Pay: ₦" + total.toLocaleString();

  // Generate unique reference
  //const refe = 'payment_order_' + Math.random().toString(36).substr(2, 9);
//    const refe = 'payment_order_' + Math.random().toString(36).substr(2, 9).replace(/[^a-zA-Z0-9]/g, '');
const refe = 'payment_order_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);

  // Send payment info to backend
  const response = await fetch('https://02aecef80acc.ngrok-free.app/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: total,
      email: email,
      currency: 'NGN',
      refer: refe
    })
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Payment data sent appropriately');
  } else {
    console.error("Error from frontEnd");
  }

  // Initialize Paystack handler
  const handler = PaystackPop.setup({
    key: 'pk_test_9ba3a415c4b1c7fdf53881fde1abaff29082117a',
    email: email,
    amount: total * 100,
    currency: 'NGN',
    ref: refe,
    callback: function (response) {
      fetch('/verify-pay?reference=' + response.reference)
        .then(res => res.json())
        .then(async (resp) => {
          if (resp.paymentStatus === 'Success') {
            document.getElementById('total').textContent = "Payment successful and order has been set";

              const selectedItems = [];
              document.querySelectorAll("#wines input").forEach(input => {
              const quantity = parseInt(input.value) || 0;
              const name = input.previousSibling.previousSibling.textContent;
              const price = parseInt(input.dataset.price);
              if (quantity > 0) {
                selectedItems.push({
                  item: name,
                  quantity,
                  price,
                  subtotal: price * quantity
                });
              }
            });

            const totalAmount = total;
            const orderRes = await fetch('/submit-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                items: selectedItems,
                total: totalAmount,
                reference: refe
              })
            });
            if (!orderRes.ok) {
              console.error("Failed to submit order");
              return console.error(`Error from booking ${orderRes.status} _ ${orderRes.statusText}`);
            }else {
              const orderData = await orderRes.json();
              console.log("Order submitted successfully:", orderData);
              document.getElementById('total').textContent = "Payment successful and order has been set";
              setTimeout(() => {
              document.getElementById('total').textContent = "";
            }, 5000);
            }
          } else if (resp.Errtr) {
            document.getElementById('total').textContent = resp.Errtr;
          } else if(resp.payErr){
            document.getElementById('total').textContent = resp.payErr || 'Verification failed.';
          }
        })
        .catch(err => {
          console.error('Verification error', err);
        })
        .finally(() => {
          hideSpinner();
        });
    },
    onClose: function () {
      hideSpinner();
      console.log('Transaction cancelled or closed');
    }
  });

  handler.openIframe();
}
let cal=document.getElementById('calculateBtn');
cal.addEventListener('click',calculateTotal);
document.addEventListener('DOMContentLoaded', async () => {
    const nameTo = document.getElementById('nameTo');
    const entryDate = document.getElementById('entry_date');
    const exitDate = document.getElementById("exit_date");
    const fname = localStorage.getItem('username');
    const check_in = localStorage.getItem('check_in');
    const check_out = localStorage.getItem('check_out');
    const email = localStorage.getItem('payEmail') || localStorage.getItem('ono');
     const Beer_Soft=[
    {
        Heineken:2000,
        Budweiser:2000,
        Champion:1500,
        Hero:1500,
        Guilder:1500,
        Life:1500,
        Desperados:1500,
        Tiger:1500,
        Mineral:1000,
        Fearless:2000,
        M_Stout:2000,
        Smooth:2000,
        Predator:1500,
        "33'":1500,
        Legend:2000,
        Raddler:1500,
        B_Ice:2000,
        Twist:1500
    },
    {
        Exotic:3500,
        NutriYo:1500,
        Hollandia:4000,
        Choco:1500,
        Water:500,
    },
    {
        'Jack Williams':15000,
        Chamdor:10000,
        'Four Cousins':18000,
        'Red Wine':10000,
        StRemy:15000,
        Comparison:25000,
        Kalahari:5000,
        'Andre Rose':18000,
        'Red Label':10000,
        'Black Label':18000,
        'William Lawson':15000,
        JW:7000,
        'RChallenge':5500,
        'Cedaa(S)':1500,
        'Cedaa(B)':2000,
        "X1(S)":3000,
        "X1(B)":11000,
        "Gordon (P)":10000,
        Toma:10000,
        "King Cream":10000,
        'Best Gin':5000,
        'Coco Samba':700,
        'Jamson(G)':38000,
        "Jamson(B)":55000,
        'Action Bitter':600,
        "Gordon (S)":2500,
        "Gordon (B)":5000,
        Monster:3000,
        "NIght Train":8000,
        '8 PM':8000,
        Wilson:15000,
        Odoqiou:1000,
        'Captain Java':4000,
        "Cario Rossi":18000,
        'Drostdy hof':12000
    }
 ]
 console.log(Beer_Soft[2].Monster);
let ew=document.getElementById('wines');
 for(let i in Beer_Soft[2]){
    console.log(i);
    console.log(Beer_Soft[2][i]);
    let price=Beer_Soft[2][i];
    let div=document.createElement('div');
    div.className='item-card';
    let span=document.createElement("span");
    span.className='item-name';
    let span2=document.createElement('span');
    span2.className='item-price';
    span.textContent=i;
    span2.textContent="Price: "+'₦ '+price.toLocaleString();
    let inp=document.createElement("input");
    inp.type='number';
    inp.min='0';
    inp.placeholder='Quantity';
    inp.dataset.price=price;
    div.appendChild(span);
    div.appendChild(span2);
    div.appendChild(inp);
    ew.appendChild(div);
 }

    let Phn = null; 
    let phnReady = false; 
    let updateBackend;
        const response = await fetch(`/regt?email=${email}`);
    if (!response.ok) return console.error('Failed to fetch /regt');

    const data = await response.json();
    const days = data.msg?.days;
    console.log(days);
    document.getElementById('rea').textContent=`Days:${days}`;
    
    // Fetch user data (now before countdown uses Phn);
    console.log(`UserData assignment: ${email}`);
    let gud=document.getElementById('gud');
    const userRes = await fetch(`/getData?email=${email}`);
    const userData = await userRes.json();
    console.log('This is userData... ',userData);
    console.log(userData.oseData.days);
    if (userData?.ozonData && userData?.oseData) {
        Phn = userData.ozonData.phone_numbers;
        phnReady = true;
        gud.textContent=`${userData.ozonData.points > 0?"You have " + userData.ozonData.points + ' show receptionist to redeem':' '}`;
        nameTo.textContent = userData.ozonData.customer_name;
        entryDate.textContent = userData.ozonData.check_in;
        exitDate.textContent = userData.ozonData.check_out;
        document.getElementById('rea').textContent=`Days:${userData.oseData.days}`
        let voices = speechSynthesis.getVoices();
        const uran = new SpeechSynthesisUtterance(`Welcome to Two Smile Hotel ${userData.ozonData.customer_name}`);
        uran.voice = voices[3];
        uran.pitch = 5;
        uran.volume = 1;
        uran.rate = 0.8;
        window.speechSynthesis.speak(uran);
        // Now safely define sendd
    }

    // Now define updateBackend safely
    updateBackend = async () => {
        try {
            const email = localStorage.getItem('payEmail') || localStorage.getItem('ono');
                let awd=await fetch(`/getReceipt?email=${email}`);
                let awdRes=await awd.json();
                console.log("Awd response in /update",awdRes);
            const res = await fetch('/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email,reference:awdRes.sen.ref })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    const speech = new SpeechSynthesisUtterance(`${fname} who booked ${data.cachedBooked?.no_of_rooms} ${data.cachedBooked?.type} rooms has to rebook. Time is up.`);
                    speech.lang = 'en-US';
                    speech.pitch = 0.7;
                    window.speechSynthesis.speak(speech);
                }
            } else {
                throw new Error("Error updating backend");
            }
        } catch (err) {
            console.error("Backend update failed", err);
        }
    };
});

let cki=document.getElementById('click');
cki.addEventListener('click',()=>{
  window.location.href='./map.html'
});

/**
 * if (days) {
      endTime = Date.now() + days * 1 * 60 * 1000;
      localStorage.setItem('endTime', endTime.toString());
      console.log("New endTime set:", new Date(endTime).toLocaleString());
    } else {
      console.warn('No valid days value from /regt');
      return;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    return;
  }
} else {
  console.log('Using stored endTime:', new Date(endTime).toLocaleString());
}

  const countdown = () => {
    const now = Date.now();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
      clearInterval(interval);
      document.getElementById('gud').textContent = '';
      localStorage.removeItem('endTime');
      document.getElementById('time').innerHTML = `
        <p id='part'>Your time is expired, Click 
        <a href="/booking.html" id='link'>here</a> 
        to rebook a room. We will get back to you at ${email}</p>`;
      document.getElementById('receiptDisplay').innerHTML = '';
      document.getElementById("labs").innerHTML = '';
      document.getElementById('rea').textContent=''
      return;
    }

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById('time').innerHTML = `
      <span id='sim'>${hours.toString().padStart(2, '0')}</span> Hours - 
      <span id='sim'>${mins.toString().padStart(2, '0')}</span> Minutes - 
      <span id='sim'>${secs.toString().padStart(2, '0')}</span> Seconds.`;

    const point = parseInt(localStorage.getItem('points')) || 0;
    const gr7 = localStorage.getItem('greatDays');

    if (gr7) {
      document.getElementById('grr').textContent =
        `Congratulations,for booking ${gr7} days, you have a complimentary breakfast till you are gone!Continue like this and be recognized as a special customer.`;
    }

    if (point >= 100 && point <= 120) {
      document.getElementById('gud').textContent =
        `You just got ${point} points for booking ${point} rooms. Show this to the receptionist to redeem your reward.`;
    }
  };

    countdown(); // run immediately
    interval = setInterval(countdown, 1000);
  
 */