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
// Ultra realistic sakura petals
function startPetals(){
    const canvas = document.getElementById("petalCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];

    const PETAL_COUNT = 60;

    for(let i=0;i<PETAL_COUNT;i++){
        petals.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            size: Math.random()*12+8,
            speedY: Math.random()*1+0.5,
            speedX: Math.random()*0.5-0.25,
            rotation: Math.random()*360,
            rotationSpeed: Math.random()*2-1,
            sway: Math.random()*2,
            opacity: Math.random()*0.6+0.4
        });
    }

    function drawPetal(p){
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            p.size/2, -p.size/2,
            p.size, p.size/2,
            0, p.size
        );
        ctx.bezierCurveTo(
            -p.size, p.size/2,
            -p.size/2, -p.size/2,
            0, 0
        );

        ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity})`;
        ctx.fill();

        ctx.restore();
    }

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);

        petals.forEach(p=>{
            p.y += p.speedY;
            p.x += Math.sin(p.sway) * 0.3 + p.speedX;
            p.rotation += p.rotationSpeed;
            p.sway += 0.01;

            if(p.y > canvas.height){
                p.y = -20;
                p.x = Math.random()*canvas.width;
            }

            drawPetal(p);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener("resize", () => {
    const canvas = document.getElementById("petalCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});