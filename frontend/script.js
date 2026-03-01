function populateTime() {
    for (let i = 1; i <= 12; i++) {
        hour.innerHTML += `<option value="${i}">${i}</option>`;
    }
    for (let i = 0; i < 60; i++) {
        minute.innerHTML += `<option value="${i}">${i}</option>`;
    }
}
populateTime();

/* ---------- PETAL SYSTEM ---------- */

function createPetalLayer(canvasId, count, speedMultiplier) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let petals = [];

    for (let i = 0; i < count; i++) {
        petals.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 12 + 6,
            speedY: (Math.random() * 1 + 0.5) * speedMultiplier,
            speedX: Math.random() * 1 - 0.5,
            rotation: Math.random() * 360
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);

            ctx.fillStyle = "rgba(255,182,193,0.9)";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-p.size/2, -p.size/2, -p.size, p.size/2, 0, p.size);
            ctx.bezierCurveTo(p.size, p.size/2, p.size/2, -p.size/2, 0, 0);
            ctx.fill();

            ctx.restore();

            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 0.5;

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(draw);
    }

    draw();
}

createPetalLayer("petalBack", 40, 0.6);
createPetalLayer("petalFront", 25, 1.2);
// Parallax effect
document.addEventListener("mousemove", (e) => {
    const wrapper = document.querySelector(".main-wrapper");
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;
    wrapper.style.transform = `translate(${x}px, ${y}px)`;
});