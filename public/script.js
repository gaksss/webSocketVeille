const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const socket = io();

// Ajuster la taille du canvas
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    const { offsetX, offsetY } = event;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Envoyer les données du dessin aux autres utilisateurs
    socket.emit("draw", { x: offsetX, y: offsetY });
}

// Recevoir les dessins des autres utilisateurs
socket.on("draw", (data) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(data.x, data.y, 5, 0, Math.PI * 2);
    ctx.fill();
});


const clearBtn = document.getElementById("clearBtn");

// Efface le canvas localement et envoie l'ordre d'effacer à tous les utilisateurs
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear");
});

// Quand un autre utilisateur efface, on efface aussi
socket.on("clear", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

