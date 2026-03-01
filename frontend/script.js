// ---------- THEME SYSTEM ----------
document.body.classList.add("spring");

const themeBtn = document.getElementById("themeBtn");
let themeIndex = 0;
const themes = ["spring","sunset","night"];
const icons = ["🌸","🌅","🌙"];

themeBtn.addEventListener("click", ()=>{
    document.body.classList.remove(...themes);
    themeIndex = (themeIndex + 1) % 3;
    document.body.classList.add(themes[themeIndex]);
    themeBtn.innerText = icons[themeIndex];
});

// ---------- TIME POPULATION ----------
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const ampm = document.getElementById("ampm");

for (let i = 1; i <= 12; i++) {
    hour.innerHTML += `<option value="${i}">${i}</option>`;
}
for (let i = 0; i < 60; i++) {
    minute.innerHTML += `<option value="${i}">${i.toString().padStart(2,"0")}</option>`;
}

const now = new Date();
let currentHour = now.getHours();
let currentMinute = now.getMinutes();
let period = currentHour >= 12 ? "PM" : "AM";
currentHour = currentHour % 12 || 12;

hour.value = currentHour;
minute.value = currentMinute;
ampm.value = period;

// ---------- SAVE LETTER ----------
const form = document.getElementById("letterForm");
const status = document.getElementById("statusMessage");
const container = document.getElementById("lettersContainer");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const letter = {
        sender: sender.value,
        recipient: recipient.value,
        date: date.value,
        time: hour.value + ":" + minute.value + " " + ampm.value,
        message: message.value
    };

    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.push(letter);
    localStorage.setItem("letters", JSON.stringify(letters));

    status.innerText = "💌 Letter saved successfully!";
    form.reset();
    displayLetters();
});

function displayLetters(){
    container.innerHTML="";
    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.forEach(l=>{
        container.innerHTML += `
            <div class="glass-card">
                <p><b>From:</b> ${l.sender}</p>
                <p><b>To:</b> ${l.recipient}</p>
                <p><b>Delivery:</b> ${l.date} ${l.time}</p>
                <p>${l.message}</p>
            </div>
        `;
    });
}
displayLetters();

// ---------- CINEMATIC PETAL ENGINE ----------
function createPetalLayer(id,count,speed,blurLevel,isFront){
    const canvas=document.getElementById(id);
    const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    let petals=[];
    for(let i=0;i<count;i++){
        petals.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            size:Math.random()*14+6,
            speedY:(Math.random()*1+0.5)*speed,
            speedX:Math.random()*0.5-0.25,
            rotation:Math.random()*360,
            opacity:Math.random()*0.5+0.4
        });
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.filter = `blur(${blurLevel}px)`;

        petals.forEach(p=>{
            ctx.save();
            ctx.translate(p.x,p.y);
            ctx.rotate(p.rotation*Math.PI/180);

            // Theme color variation
            let color;
            if(document.body.classList.contains("night")){
                color = `rgba(255,182,193,${p.opacity})`;
                if(isFront){
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = "rgba(255,200,220,0.6)";
                }
            }
            else if(document.body.classList.contains("sunset")){
                color = `rgba(255,140,120,${p.opacity})`;
            }
            else{
                color = `rgba(255,192,203,${p.opacity})`;
            }

            ctx.fillStyle=color;

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.bezierCurveTo(-p.size/2,-p.size/2,-p.size,p.size/2,0,p.size);
            ctx.bezierCurveTo(p.size,p.size/2,p.size/2,-p.size/2,0,0);
            ctx.fill();

            ctx.restore();

            p.y+=p.speedY;
            p.x+=p.speedX;
            p.rotation+=0.4;

            if(p.y>canvas.height){
                p.y=-10;
                p.x=Math.random()*canvas.width;
            }
        });

        requestAnimationFrame(draw);
    }
    draw();
}

// Back layer (soft blurred far petals)
createPetalLayer("petalBack",45,0.5,3,false);

// Front layer (sharp closer petals)
createPetalLayer("petalFront",30,1.2,0,true);

// ---------- PARALLAX DEPTH ----------
document.addEventListener("mousemove", (e)=>{
    const wrapper = document.querySelector(".main-wrapper");
    const x = (window.innerWidth/2 - e.clientX)/40;
    const y = (window.innerHeight/2 - e.clientY)/40;
    wrapper.style.transform = `translate(${x}px, ${y}px)`;
});