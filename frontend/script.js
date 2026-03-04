// ================= THEME SYSTEM =================

function setTheme(theme){
    document.body.className = "theme-" + theme;
    localStorage.setItem("theme", theme);
}

// ================= PAGE LOAD =================

window.onload = function(){

    const savedTheme = localStorage.getItem("theme");
    if(savedTheme){
        document.body.className = "theme-" + savedTheme;
    }

    populateTime();
    displayLetters();
    startPetals();
};

// ================= TIME SETUP =================

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

    currentHour = currentHour % 12 || 12;

    hour.value = currentHour;
    minute.value = now.getMinutes().toString().padStart(2,"0");

    document.getElementById("ampm").value = ampm;
}

// ================= FORM SUBMIT =================

document.getElementById("letterForm").addEventListener("submit", function(e){

    e.preventDefault();

    const letter = {

        id: Date.now(),

        sender: document.getElementById("name").value,

        recipient: document.getElementById("email").value,

        message: document.getElementById("message").value,

        date: document.getElementById("date").value,

        time:
        document.getElementById("hour").value + ":" +
        document.getElementById("minute").value + " " +
        document.getElementById("ampm").value
    };

    let letters = JSON.parse(localStorage.getItem("letters")) || [];

    letters.push(letter);

    localStorage.setItem("letters", JSON.stringify(letters));

    document.getElementById("statusMsg").innerText =
    "Letter saved successfully 💌";

    document.getElementById("envelope").classList.add("open");

    displayLetters();

});

// ================= DISPLAY LETTERS =================

function displayLetters(){

    const container = document.getElementById("lettersContainer");

    if(!container) return;

    container.innerHTML = "";

    let letters = JSON.parse(localStorage.getItem("letters")) || [];

    letters.forEach(letter => {

        const card = document.createElement("div");

        card.className = "letter-card";

        card.innerHTML = `
        <h3>${letter.sender} → ${letter.recipient}</h3>
        <p>${letter.message}</p>
        <p>Delivery: ${letter.date} ${letter.time}</p>
        <div class="countdown" id="count-${letter.id}"></div>
        `;

        container.appendChild(card);

        startCountdown(letter);
    });
}

// ================= COUNTDOWN TIMER =================

function startCountdown(letter){

    const el = document.getElementById("count-" + letter.id);

    const interval = setInterval(()=>{

        const now = new Date();

        const delivery = new Date(letter.date + " " + letter.time);

        const diff = delivery - now;

        if(diff <= 0){

            el.innerText = "Delivered 💌";

            clearInterval(interval);

            return;
        }

        const hours = Math.floor(diff / (1000*60*60));

        const minutes = Math.floor(
            (diff % (1000*60*60)) / (1000*60)
        );

        const seconds = Math.floor(
            (diff % (1000*60)) / 1000
        );

        el.innerText =
        `Opens in ${hours}h ${minutes}m ${seconds}s`;

    },1000);
}

// ================= CINEMATIC SAKURA SYSTEM =================

function startPetals(){

    const canvas = document.getElementById("petalCanvas");
    const ctx = canvas.getContext("2d");

    function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const petals = [];

    for(let i=0;i<60;i++){

        petals.push({

            x: Math.random()*canvas.width,

            y: Math.random()*canvas.height,

            size: Math.random()*10+6,

            speed: Math.random()*1+0.5,

            drift: Math.random()*0.5 - 0.25,

            rotation: Math.random()*360,

            rotationSpeed: Math.random()*1 - 0.5
        });
    }

    function draw(){

        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="rgba(255,182,193,0.8)";

        petals.forEach(p=>{

            ctx.save();

            ctx.translate(p.x,p.y);

            ctx.rotate(p.rotation * Math.PI/180);

            ctx.beginPath();

            ctx.ellipse(0,0,p.size,p.size*0.6,0,0,Math.PI*2);

            ctx.fill();

            ctx.restore();

            p.y += p.speed;
            p.x += p.drift;
            p.rotation += p.rotationSpeed;

            if(p.y > canvas.height){

                p.y = 0;
                p.x = Math.random()*canvas.width;

            }

        });

        requestAnimationFrame(draw);
    }

    draw();
}