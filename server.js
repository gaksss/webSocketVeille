const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir les fichiers statiques
app.use(express.static("public"));

// Écoute des connexions WebSocket
io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    // Réception des données de dessin et diffusion à tous les clients
    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
    });

    // Réception de l'ordre d'effacer et diffusion à tous les clients
    socket.on("clear", () => {
        io.emit("clear");
    });
    
    // Gestion de la déconnexion
    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });
});

// Démarrer le serveur
server.listen(3000, () => {
    console.log("Serveur en ligne sur http://localhost:3000");
});
