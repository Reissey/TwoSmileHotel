
const showSpinner=()=>{
    document.getElementById('loadingSpinner').style.display='block'
}
const hideSpinner=()=>{
    document.getElementById('loadingSpinner').style.display='none'
}

let call=()=>{    
const recognize= new webkitSpeechRecognition()
recognize.continuous=true;
recognize.interimResults=true;
recognize.lang='en-US';
recognize.onstart=()=>{
    console.log('Speech recognition started')
}

recognize.onend=()=>{
    console.log('Speech recogniton ended');
    stop();
}

recognize.onerror=(event)=>{
    console.error(`Error in speech recognition ${event.error}`);
}
recognize.onspeechend=()=>{
    console.log('Speech ended')
    stop();
}
let trans = '';

const checkWords = (trans) => {
    const keywords = ['open', 'proceed'];
    const changed = trans.toLowerCase();
    keywords.forEach(keyword => {
        if (changed.includes(keyword)) {
            theFunc(keyword);
        }
    });
};

const theFunc = (keyword) => {   
    switch (keyword) {
        case 'open':
            console.log('working 1...');
            window.location.href = 'table.html';
            break;
        case 'proceed':
            console.log('working 2...');
            window.location.href = 'table.html';
            break;
        default:
            return;
    }
};

recognize.onresult = (event) => {
    trans = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
    checkWords(trans);
    console.log('Heard', trans);
};


const start = () => {
    recognize.start();
};
const stop = () => {
    recognize.stop();
};

start()
}
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
