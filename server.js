// Chargement du fichier de configuration
import 'dotenv/config'

// Importations générales du projet
import express, { json } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression';
import { engine } from 'express-handlebars';

// Importations du modèle et des middlewares de validation
import { getFilms, addFilm, updateFilmEstVu, deleteFilm } from './model/film.js';
import {
    idFilmValide,
    titreValide,
    genreValide,
    anneeValide,
    noteValide,
    estVuValide
} from './middlewares/validation.js';

// Création du serveur
const app = express();

// Initialisation des engins
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Ajout des middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(express.static('public'));

// Programmation des routes de rendu
app.get('/', async (request, response) => {
    const films = await getFilms();

    response.status(200).render('home', {
        title: 'Vidéothèque',
        styles: ['/css/style.css'],
        scripts: ['/js/main.js'],
        films: films
    });
});

// Programmation des routes

// Ajouter un film
app.post('/api/film', titreValide, genreValide, anneeValide, noteValide, async (request, response) => {
    const id_film = await addFilm(
        request.body.titre,
        request.body.genre,
        request.body.annee,
        request.body.note
    );

    response.status(201).json({ id_film: id_film });
});

// Marquer un film comme vu ou pas vu
app.patch('/api/film', idFilmValide, estVuValide, async (request, response) => {
    await updateFilmEstVu(request.body.id_film, request.body.est_vu);

    response.status(200).end();
});

// Supprimer un film
app.delete('/api/film', idFilmValide, async (request, response) => {
    await deleteFilm(request.body.id_film);

    response.status(200).end();
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré:');
console.log('http://localhost:' + process.env.PORT);
