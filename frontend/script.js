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
// Ultra cinematic sakura system
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
    const FRONT_COUNT = 30;

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function randomColor() {
        const shades = [
            "rgba(255,182,193,",   // soft pink
            "rgba(255,192,203,",   // classic sakura
            "rgba(255,160,180,",   // deeper pink
            "rgba(255,220,230,"    // pale blossom
        ];
        return shades[Math.floor(Math.random() * shades.length)];
    }

    function createPetal(depth) {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: depth === "back"
                ? Math.random() * 10 + 6
                : Math.random() * 16 + 10,
            speedY: depth === "back"
                ? Math.random() * 0.5 + 0.3
                : Math.random() * 1 + 0.6,
            speedX: Math.random() * 0.4 - 0.2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 1.5 - 0.75,
            sway: Math.random() * 2,
            opacity: depth === "back"
                ? Math.random() * 0.3 + 0.3
                : Math.random() * 0.5 + 0.5,
            color: randomColor(),
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

        ctx.shadowColor = "rgba(255,200,220,0.4)";
        ctx.shadowBlur = 6;

        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();

        ctx.restore();
    }

    let wind = 0;
    let gustStrength = 0;
    let gustTimer = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Natural wind oscillation
        wind += 0.0015;
        const windFlow = Math.sin(wind) * 0.3;

        // Random gust burst every few seconds
        gustTimer++;
        if (gustTimer > 400) {
            gustStrength = (Math.random() - 0.5) * 2;
            gustTimer = 0;
        }

        function updateLayer(layer) {
            layer.forEach(p => {
                // Mouse interaction
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                }

                p.y += p.speedY;
                p.x += Math.sin(p.sway) * 0.4 + p.speedX + windFlow + gustStrength;
                p.rotation += p.rotationSpeed;
                p.sway += 0.01;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                drawPetal(p);
            });
        }

        // Back depth
        ctx.filter = "blur(1px)";
        updateLayer(backLayer);

        // Front depth
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