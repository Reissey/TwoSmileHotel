 
  
          console.log("Oks")
        const images=['./booking1.JPG','./booking2.JPG','booking3.JPG','./booking4.JPG'];
        let index=0;
        let dis=document.getElementById('hyu');
        setInterval(()=>{
            dis.style.backgroundImage=`url(${images[index]})`
            index=(index + 1) % images.length;
        },3000);
        console.log('Hmmm...');
 