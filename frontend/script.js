// Populate time selectors
function populateTimeSelectors() {
    const hour = document.getElementById("hour");
    const minute = document.getElementById("minute");

    for (let i = 1; i <= 12; i++) {
        hour.innerHTML += `<option value="${i}">${i}</option>`;
    }

    for (let i = 0; i < 60; i++) {
        const val = i < 10 ? "0" + i : i;
        minute.innerHTML += `<option value="${val}">${val}</option>`;
    }
}
populateTimeSelectors();


// Flower Animation
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 10 + 8;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        ctx.fillStyle = "rgba(255, 182, 193, 0.9)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/2, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size/2, this.size/2, -this.size/2, 0, 0);
        ctx.fill();

        ctx.restore();
    }
}

let petals = [];
for (let i = 0; i < 50; i++) {
    petals.push(new Petal());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

animate();