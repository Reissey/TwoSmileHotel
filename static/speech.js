const showSpinner=()=>{
    document.getElementById('loadingSpinner').style.display='block'
}

const hideSpinner=()=>{
    document.getElementById('loadingSpinner').style.display='none'
}

let recognize;

const initRecognition = () => {
  recognize = new webkitSpeechRecognition();
  recognize.continuous = false;
  recognize.interimResults = false;
  recognize.lang = 'en-US';

  recognize.onstart = () => console.log('Speech recognition started');
  recognize.onend = () => {
    console.log('Speech recognition ended');
  };
  recognize.onerror = (event) => {
    console.error(`Speech recognition error: ${event.error}`);
  };
  recognize.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('Heard:', transcript);
    if (transcript.includes('open') || transcript.includes('proceed')) {
      window.location.href = 'table.html';
    } else {
      alert('Voice command not recognized. Please say "open" or "proceed".');
    }
  };
};

initRecognition();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const role = text.value.trim().toLowerCase();
  const method = document.getElementById('sell').value;

  if (role === 'manager' || role === 'receptionist') {
    if (method === 'Recognition') {
      recognize.start();
    } else if (method === 'LogIn') {
      showSpinner();
      window.location.href = 'table.html';
    } else {
      alert('Please select a login method');
    }
  } else {
    const pl = document.getElementById('pl');
    pl.textContent = 'Wrong Password';
    setTimeout(() => {
      pl.textContent = '';
      submitBtn.disabled = true;
    }, 5000);
  }
});

//document.getElementById('sell').style.display='none'
const text=document.getElementById('text')
const submitBtn=document.getElementById('sub');
const form=document.getElementById('form');

text.addEventListener('input',()=>{
    submitBtn.style.display='block';
})

form.addEventListener('submit',(e)=>{
try{
    e.preventDefault();

    const role=text.value.trim().toLowerCase();
    if(role === 'manager' || role==='receptionist'){

        document.getElementById('sub').style.display='block';
        document.getElementById('sell').style.display='block'
        const select=document.getElementById('sell').value;
    
    switch(select){
        case 'Recognition':
            submitBtn.disabled=false
            text.style.display='block';
            if(text.value === 'manager' || text.value === 'receptionist'){
                call();
            }
            break
            case 'LogIn':
                submitBtn.disabled=false
                text.style.display='block';
                if(text.value === 'manager' || text.value === 'receptionist'){
                    window.location.href='table.html';
                }
                showSpinner()
    }
    }else{
        const pl=document.getElementById('pl');
        pl.textContent='Wrong Password';
        setTimeout(()=>{
            pl.textContent=''
            submitBtn.disabled=true
            },5000)
    }
}catch(err){
    console.error('Error in logging in',err)
}finally{
    submitBtn.disabled=false
    console.log("Done with logging into the table page.");
    hideSpinner()
}
    
})

const func=async()=>{
    const fer=await fetch('/register');
    const awa=await fer.json();
    const emailErr=document.getElementById('EmailErr')
    emailErr.textContent=awa.EmailErrMsg;
}
func();
