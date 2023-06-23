// serveur pour pixelWar avec base de données

// data base temporaire
let pixelsTemporaires = [];


//serveur 
const express = require('express');
const app = express();
const server = app.listen('4000');
app.use(express.static('public'));
console.log('serveur Pixel War ok sur 4000');


//base de donnée
const Datastore = require('nedb'); //import neDB
const db = new Datastore({ filename: 'public/pixelWar.db', autoload: true });


// WebSocket 
// WebSockets initialisation avec le http serveur
const socket = require('socket.io');
const io = socket(server);

// fonction de retour si une connection + mise à jour base temp
io.sockets.on('connection', newConnection);

// fonction de retour si déconnection
io.sockets.on('disconnect',()=> { console.log("Joueur deconnecté"); }); 

//enregistre la base de donnée toute les **** ms
setInterval(() => enregistreDataBase(pixelsTemporaires), 9000);


//fonction qui recois et envoie les données lorsqu'il y a connection
function newConnection(socket) {
    console.log("nouveau joueur: " + socket.id);
    socket.on('miseAjourPixel', trierPixel); // si un joueur emit(envoie) des données
    function trierPixel(data) {
        console.log(data);
        // Réenvoie les données aux autres joueurs
        socket.broadcast.emit('miseAjourPixel', data);

        try {
            const numeroPixel = data.a; // Remplacez 'a' par la propriété correcte contenant le numéro de pixel
            const couleur = data.c; // Remplacez 'c' par la propriété correcte contenant la couleur

            if (numeroPixel !== undefined && couleur !== undefined) {
                const index = pixelsTemporaires.findIndex((pixel) => pixel.numeroPixel === numeroPixel);
                if (index !== -1) {
                    pixelsTemporaires[index].couleur = couleur;
                } else {
                    pixelsTemporaires.push({ numeroPixel, couleur });
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données des pixels :', error);
        }
    }


}



//fonction pour enregistrer la base temp dans la base de données
function enregistreDataBase(data) {
    data.forEach(({ numeroPixel, couleur }) => {
        db.update({ numeroPixel },
            { $set: { couleur } },
            { upsert: true },
            (err, numRemplaced, upsert) => {
                if (err) {
                    console.error('erreur de mise a jour des données : ', err);
                    return;
                }
                if (upsert) {
                    console.log('nouveau pixel enregistré: ', numeroPixel);
                    db.loadDatabase();
                }
                else if (numRemplaced) {
                    console.log('pixel mise a jour: ', numeroPixel);
                    db.loadDatabase();

                }
            });
    });
    pixelsTemporaires = [];
}
