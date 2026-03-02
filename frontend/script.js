// Theme persistence
function setTheme(theme){
    document.body.className = "theme-" + theme;
    localStorage.setItem("theme", theme);
}

window.onload = function(){
    const savedTheme = localStorage.getItem("theme");
    if(savedTheme){
        document.body.className = "theme-" + savedTheme;
    }

    populateTime();
    startPetals();
}

// Time setup
function populateTime(){
    const hour = document.getElementById("hour");
    const minute = document.getElementById("minute");

    for(let i=1;i<=12;i++){
        hour.innerHTML += `<option>${i}</option>`;
    }

    for(let i=0;i<60;i++){
        minute.innerHTML += `<option>${i.toString().padStart(2,"0")}</option>`;
    }

    const now = new Date();
    let currentHour = now.getHours();
    let ampm = currentHour >=12 ? "PM" : "AM";
    currentHour = currentHour%12 || 12;

    hour.value = currentHour;
    minute.value = now.getMinutes().toString().padStart(2,"0");
    document.getElementById("ampm").value = ampm;
}

// Form submit
document.getElementById("letterForm").addEventListener("submit", function(e){
    e.preventDefault();

    document.getElementById("statusMsg").innerText = "Letter saved successfully 💌";
    document.getElementById("envelope").classList.add("open");
});

// Petals
function startPetals(){
    const canvas = document.getElementById("petalCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];

    for(let i=0;i<40;i++){
        petals.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            size:Math.random()*8+4,
            speed:Math.random()*1+0.5,
            drift:Math.random()*1-0.5
        });
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="rgba(255,182,193,0.7)";
        petals.forEach(p=>{
            ctx.beginPath();
            ctx.ellipse(p.x,p.y,p.size,p.size*0.6,0,0,Math.PI*2);
            ctx.fill();

            p.y += p.speed;
            p.x += p.drift;

            if(p.y>canvas.height){
                p.y=0;
                p.x=Math.random()*canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}