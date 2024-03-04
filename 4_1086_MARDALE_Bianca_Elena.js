const fileInput = document.getElementById('fileBrowser');
let canvas = document.getElementById('visibleCanvas');
let ctx =  canvas.getContext("2d", {
    willReadFrequently: true,
});

const mid = document.getElementById('midRight');

let image = new Image();
let incarcare = false;

let latimeaDorita = document.getElementById("latime");
let inaltimeaDorita = document.getElementById("inaltime");
let proportiaOriginala;



function incarcareImagine(){
    fileInput.addEventListener('change', e=> {
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.addEventListener('load', () => {
            image.src = reader.result;

            image.addEventListener('load', () => {
                canvas.width = image.width;
                canvas.height = image.height;

                ctx.drawImage(image, 0, 0);
                incarcare = true;

                proportiaOriginala = image.width / image.height;
                latimeaDorita.value = image.width;
                inaltimeaDorita.value = image.height;

                // console.log(latimeaDorita);
            });
        });

        reader.readAsDataURL(file);

    });
}

incarcareImagine();


function salvareImagine(){
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png", 1);
    a.download = "image.png";
    a.click();
}


const salvareButton = document.getElementById("salvare")
salvareButton.addEventListener("click", function () {
    salvareImagine()
})


const cropButton = document.getElementById("crop")
cropButton.addEventListener("click", function () {
})

//Execrciutiu scalare
function scalare(latime, inaltime){
    canvas.width = latime;
    canvas.height = inaltime;
    latimeaDorita.value = latime;
    inaltimeaDorita.value = inaltime;
    ctx.drawImage(image, 0, 0, latime, inaltime);
   
}

const latimeButton = document.getElementById("butonLatime")
const inaltimeButton = document.getElementById("butonInaltime")
const inputW = document.getElementById('latime');
const inputH = document.getElementById('inaltime');


latimeButton.addEventListener("click", function () {
    if(alerta()==false){
        return false
    }
    else{
        inputW.classList.toggle('active')  
    }
});

inaltimeButton.addEventListener("click", function () {
    if(alerta()==false){
        return false
    }
    else{
        inputH.classList.toggle('active')
    }
    
});

function alerta(){
    if(incarcare==false){
        window.alert("Incarcati o imagine")
        return false;
    }
}


document.getElementById("scalare").addEventListener("click", function () {
    const inaltimeProportionata = latimeaDorita.value / proportiaOriginala;
    const latimeProportionata = inaltimeaDorita.value  * proportiaOriginala;
    scalare(latimeProportionata, inaltimeProportionata);
  
});


const textButton = document.getElementById("adaugareText")

textButton.addEventListener('click', () => {
    furnizareText();
});


const text = document.getElementById('text');
const dimensiune = document.getElementById('dimensiune');
const culoare = document.getElementById('culoare');
const x = document.getElementById('x');
const y = document.getElementById('y');


const infoButton = document.getElementById("info")
infoButton.addEventListener('click', ()=>{
    if(alerta()==false){
        return false
    }
    else{
        text.classList.toggle('active')
        dimensiune.classList.toggle('active')
        culoare.classList.toggle('active')
        x.classList.toggle('active')
        y.classList.toggle('active')
    }
   
  
})

function furnizareText(){
    if(text.value == "" || dimensiune.value == 0 ||  x.value == 0 || y.value ==0){
        window.alert("Completati toate campurile");
        return false;
    }
    else{
        ctx.font = `${dimensiune.value}px Arial`;
        ctx.fillStyle = culoare.value;
        ctx.fillText(text.value, x.value, y.value);
    }
}

const selectieButton = document.getElementById("selecte")
//selectie

let suprafataSelectie = {
    x : 0, 
    y: 0,
    width : 0,
    height : 0
};

let flag = false;

function selectie(){
    
    ctx.strokeStyle = "	#151e3f";
    ctx.lineWidth = 10;
   
    canvas.addEventListener("mousedown", function(event){
        flag = true;
        suprafataSelectie.x = event.offsetX;
         suprafataSelectie.y = event.offsetY;
     
    });

    canvas.addEventListener("mousemove", function(event){
        if(flag){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            
            suprafataSelectie.width = event.offsetX - suprafataSelectie.x;
            suprafataSelectie.height = event.offsetY - suprafataSelectie.y;

            ctx.strokeRect(suprafataSelectie.x, suprafataSelectie.y, suprafataSelectie.width, suprafataSelectie.height);
        //    console.log(suprafataSelectie.width, suprafataSelectie.height)
            canvas.addEventListener("mouseup", function(event){
                flag = false;
            })
        }
    })
}


selectieButton.addEventListener('click', () => {
    selectie(canvas);
});


const stergereSeectie = document.getElementById("stergereSeectie")

function stergerePixeli(canvas) {
    
    const imgData = ctx.getImageData(suprafataSelectie.x, suprafataSelectie.y, suprafataSelectie.width, suprafataSelectie.height);
    
    const pixels = imgData.data;
    for (let i = 0; i < pixels.length; i+=4) {
        pixels[i] = 255;
      }

      ctx.putImageData(imgData, suprafataSelectie.x, suprafataSelectie.y );
  }
stergereSeectie.addEventListener('click', () => {
    stergerePixeli(canvas)
    
});


const histoButton = document.getElementById("hisograma");


histoButton.addEventListener('click', ()=>{
   
});
 
const grayButton = document.getElementById("gray");
function gray(){
    if(alerta()==false){
        return false
    }
    else{
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data; 
        for(let i = 0; i < pixels.length; i += 4){
            pixels[i] = pixels[i + 1] = pixels[i+2] = Math.round((pixels[i]
                + pixels[i+1] + pixels[i+2]) / 3);
        }
    
        ctx.putImageData(imgData, 0, 0);
    }
    
}
grayButton.addEventListener('click', ()=>{
    gray();
});


const sepiaButton = document.getElementById("sepia");

function sepia(){
    if(alerta()==false){
        return false
    }
    else{
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data; 
        for(let i = 0; i < pixels.length; i += 4){
            let r = pixels[i];
            let g = pixels[i+1];
            let b = pixels[i+2];
    
            pixels[i] = (r * 0.393) + (g * 0.769) + (b * 0.189)
            pixels[i+1] = (r * 0.349) + (g * 0.686) + (b * 0.168)
            pixels[i+2] = (r * 0.272) + (g * 0.534) + (b * 0.131)  
        }
    
        ctx.putImageData(imgData, 0, 0);
    }
   
}

sepiaButton.addEventListener('click', ()=>{
   sepia();
});

const invertButton = document.getElementById("invert");

function invert(){
    if(alerta()==false){
        return false
    }
    else{
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data; 
        for(let i = 0; i < pixels.length; i += 4){
            let r = pixels[i];
            let g = pixels[i+1];
            let b = pixels[i+2];
    
            pixels[i] = 255 - r;
            pixels[i+1] = 255 - g;
            pixels[i+2] = 255 - b;
        }
    
        ctx.putImageData(imgData, 0, 0);
    }
   
}

invertButton.addEventListener('click', ()=>{
   invert();
});





  
  
  
  
 



