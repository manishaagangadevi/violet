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
// Cinematic multi-layer sakura system
function startPetals() {
    const canvas = document.getElementById("petalCanvas");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const backLayer = [];
    const frontLayer = [];

    const BACK_COUNT = 35;
    const FRONT_COUNT = 25;

    function createPetal(depth) {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: depth === "back"
                ? Math.random() * 10 + 6
                : Math.random() * 14 + 10,
            speedY: depth === "back"
                ? Math.random() * 0.6 + 0.3
                : Math.random() * 1 + 0.7,
            speedX: Math.random() * 0.4 - 0.2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 1.5 - 0.75,
            sway: Math.random() * 2,
            opacity: depth === "back"
                ? Math.random() * 0.3 + 0.3
                : Math.random() * 0.5 + 0.5,
            depth: depth
        };
    }

    for (let i = 0; i < BACK_COUNT; i++) {
        backLayer.push(createPetal("back"));
    }

    for (let i = 0; i < FRONT_COUNT; i++) {
        frontLayer.push(createPetal("front"));
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            p.size / 2, -p.size / 2,
            p.size, p.size / 2,
            0, p.size
        );
        ctx.bezierCurveTo(
            -p.size, p.size / 2,
            -p.size / 2, -p.size / 2,
            0, 0
        );

        ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity})`;
        ctx.fill();

        ctx.restore();
    }

    let wind = 0;
    let windDirection = 1;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gentle wind oscillation
        wind += 0.002 * windDirection;
        if (wind > 0.3 || wind < -0.3) {
            windDirection *= -1;
        }

        function updateLayer(layer) {
            layer.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(p.sway) * 0.4 + p.speedX + wind;
                p.rotation += p.rotationSpeed;
                p.sway += 0.01;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                drawPetal(p);
            });
        }

        // Back layer (slightly blurred)
        ctx.filter = "blur(1px)";
        updateLayer(backLayer);

        // Front layer (sharp)
        ctx.filter = "none";
        updateLayer(frontLayer);

        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener("resize", () => {
    const canvas = document.getElementById("petalCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});