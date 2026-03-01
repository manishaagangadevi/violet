// Populate time
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");

for (let i = 1; i <= 12; i++) {
    hour.innerHTML += `<option>${i}</option>`;
}
for (let i = 0; i < 60; i++) {
    minute.innerHTML += `<option>${i.toString().padStart(2,"0")}</option>`;
}

// Restore theme
const themeBtn = document.getElementById("themeBtn");
let themeState = localStorage.getItem("themeState") || 0;
applyTheme(themeState);

themeBtn.addEventListener("click", () => {
    themeState = (parseInt(themeState) + 1) % 3;
    localStorage.setItem("themeState", themeState);
    applyTheme(themeState);
});

function applyTheme(state){
    document.body.classList.remove("sunset","night");
    if(state == 1){
        document.body.classList.add("sunset");
        themeBtn.innerText="🌅";
    } else if(state == 2){
        document.body.classList.add("night");
        themeBtn.innerText="🌙";
    } else {
        themeBtn.innerText="🌸";
    }
}

// Music (must click to play)
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

musicBtn.addEventListener("click", () => {
    if(bgMusic.paused){
        bgMusic.play();
        musicBtn.innerText="🔊";
    } else {
        bgMusic.pause();
        musicBtn.innerText="🎵";
    }
});

// Save Letter
const form = document.getElementById("letterForm");
const status = document.getElementById("statusMessage");
const container = document.getElementById("lettersContainer");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const letter = {
        sender: document.getElementById("sender").value,
        recipient: document.getElementById("recipient").value,
        date: document.getElementById("date").value,
        hour: hour.value,
        minute: minute.value,
        ampm: document.getElementById("ampm").value,
        message: document.getElementById("message").value
    };

    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.push(letter);
    localStorage.setItem("letters", JSON.stringify(letters));

    status.innerText = "💌 Letter saved successfully!";
    form.reset();
    displayLetters();
});

// Display saved letters
function displayLetters(){
    container.innerHTML="";
    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.forEach(l=>{
        container.innerHTML += `
            <div class="glass-card">
                <p><b>From:</b> ${l.sender}</p>
                <p><b>To:</b> ${l.recipient}</p>
                <p><b>Delivery:</b> ${l.date} ${l.hour}:${l.minute} ${l.ampm}</p>
                <p>${l.message}</p>
            </div>
        `;
    });
}

displayLetters();

// Petals
function createPetalLayer(id,count,speed){
    const canvas=document.getElementById(id);
    const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    let petals=[];
    for(let i=0;i<count;i++){
        petals.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            size:Math.random()*10+5,
            speedY:(Math.random()*1+0.5)*speed,
            speedX:Math.random()*0.5-0.25
        });
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        petals.forEach(p=>{
            ctx.fillStyle="rgba(255,182,193,0.9)";
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
            ctx.fill();

            p.y+=p.speedY;
            p.x+=p.speedX;

            if(p.y>canvas.height){
                p.y=-10;
                p.x=Math.random()*canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}

createPetalLayer("petalBack",40,0.6);
createPetalLayer("petalFront",25,1.2);