document.addEventListener('DOMContentLoaded',()=>{

 });

let firstname=document.getElementById('firstname');
const getRegErr = async () => {
    try {
        const data = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!data.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const res = await data.json();
        const msgErr = document.getElementById('ereR');
        if(res.msg){
            msgErr.textContent = `${res.msg}`;
        }
        else if(res.EmailErrMsg){
            msgErr.textContent=`${res.EmailErrMsg}`
        } 
        else if(res.msg){
            msgErr.textContent='Registration Successful...'
        }

    } catch (err) {
        const msgErr = document.getElementById('ereR');
        msgErr.textContent = `Error: ${err.message}`;
        console.error('Error:', err.stack);
    }
};