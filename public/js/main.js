import {
    isTitreValide,
    isGenreValide,
    isAnneeValide,
    isNoteValide
} from './validation.js';

// Éléments du formulaire d'ajout
const formFilm = document.getElementById('form-film');
const inputTitre = document.getElementById('input-titre');
const inputGenre = document.getElementById('input-genre');
const inputAnnee = document.getElementById('input-annee');
const inputNote = document.getElementById('input-note');

// Champs d'erreur du formulaire d'ajout
const erreurTitre = document.getElementById('erreur-titre');
const erreurGenre = document.getElementById('erreur-genre');
const erreurAnnee = document.getElementById('erreur-annee');
const erreurNote = document.getElementById('erreur-note');

// Liste des films
const listeFilms = document.getElementById('liste-films');

// Boutons des films présents au chargement de la page (générés
// par Handlebars)
const boutonsVu = document.querySelectorAll('#liste-films .film-vu');
const boutonsSupprimer = document.querySelectorAll('#liste-films .film-supprimer');

/**
 * Enlève tous les messages d'erreur du formulaire.
 */
function viderErreurs() {
    erreurTitre.innerText = '';
    erreurGenre.innerText = '';
    erreurAnnee.innerText = '';
    erreurNote.innerText = '';
}

/**
 * Valide un film. S'il n'est pas valide, affiche les messages
 * d'erreur dans le formulaire.
 * @param {Object} film Le film à valider.
 * @returns Une valeur indiquant si le film est valide ou non.
 */
function isFilmValide(film) {
    let valide = true;

    if(!isTitreValide(film.titre)) {
        erreurTitre.innerText = 'Le titre est obligatoire.';
        valide = false;
    }

    if(!isGenreValide(film.genre)) {
        erreurGenre.innerText = 'Le genre est obligatoire.';
        valide = false;
    }

    if(!isAnneeValide(film.annee)) {
        erreurAnnee.innerText = 'L\'année doit être un nombre entier entre 1900 et 2026.';
        valide = false;
    }

    if(!isNoteValide(film.note)) {
        erreurNote.innerText = 'La note doit être un nombre entier entre 1 et 5.';
        valide = false;
    }

    return valide;
}

/**
 * Ajoute un film dans la liste de l'interface graphique.
 * @param {number} id_film L'identifiant du film.
 * @param {string} titre Le titre du film.
 * @param {string} genre Le genre du film.
 * @param {number} annee L'année de sortie du film.
 * @param {number} note La note du film.
 */
function addFilmClient(id_film, titre, genre, annee, note) {
    // La structure d'un film dans l'interface graphique est la même
    // que celle du fichier /views/partials/film.handlebars

    // Création du <li>
    const li = document.createElement('li');
    li.classList.add('film');
    li.dataset.idFilm = id_film;
    li.dataset.vu = 0;

    // Création des informations du film
    const divInfo = document.createElement('div');
    divInfo.classList.add('film-info');
    li.append(divInfo);

    const h3 = document.createElement('h3');
    h3.innerText = titre;
    divInfo.append(h3);

    const p = document.createElement('p');
    p.innerText = genre + ' - ' + annee + ' - Note : ' + note + '/5';
    divInfo.append(p);

    // Création des actions du film
    const divActions = document.createElement('div');
    divActions.classList.add('film-actions');
    li.append(divActions);

    const spanEtat = document.createElement('span');
    spanEtat.classList.add('film-etat');
    spanEtat.innerText = 'Pas vu';
    divActions.append(spanEtat);

    const boutonVu = document.createElement('button');
    boutonVu.type = 'button';
    boutonVu.classList.add('film-vu');
    boutonVu.dataset.idFilm = id_film;
    boutonVu.innerText = 'Marquer comme vu';
    boutonVu.addEventListener('click', updateFilmServeur);
    divActions.append(boutonVu);

    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.type = 'button';
    boutonSupprimer.classList.add('film-supprimer');
    boutonSupprimer.dataset.idFilm = id_film;
    boutonSupprimer.innerText = 'Supprimer';
    boutonSupprimer.addEventListener('click', deleteFilmServeur);
    divActions.append(boutonSupprimer);

    // Ajouter le film dans la liste
    listeFilms.append(li);
}

/**
 * Envoie une requête pour ajouter un film sur le serveur. Si le film
 * est correctement ajouté sur le serveur, on l'ajoute aussi dans
 * l'interface graphique.
 * @param {SubmitEvent} event Évènement de soumission du formulaire.
 */
async function addFilmServeur(event) {
    event.preventDefault();

    // Préparation des données
    const data = {
        titre: inputTitre.value,
        genre: inputGenre.value,
        annee: Number(inputAnnee.value),
        note: Number(inputNote.value)
    };

    // Validation
    viderErreurs();
    if(!isFilmValide(data)) {
        return;
    }

    // Envoi de la requête
    const response = await fetch('/api/film', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Traitement de la réponse
    if(response.ok) {
        const valeur = await response.json();
        addFilmClient(valeur.id_film, data.titre, data.genre, data.annee, data.note);
        formFilm.reset();
    }
}

/**
 * Envoie une requête pour marquer un film comme vu ou pas vu sur le
 * serveur, puis met l'interface graphique à jour.
 * @param {MouseEvent} event Évènement du clic sur le bouton.
 */
async function updateFilmServeur(event) {
    const bouton = event.currentTarget;
    const li = listeFilms.querySelector(`li[data-id-film="${bouton.dataset.idFilm}"]`);

    // Le nouvel état est l'inverse de l'état actuel
    let est_vu = 1;
    if(Number(li.dataset.vu) === 1) {
        est_vu = 0;
    }

    // Préparation des données
    const data = {
        id_film: Number(bouton.dataset.idFilm),
        est_vu: est_vu
    };

    // Envoi de la requête
    const response = await fetch('/api/film', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Traitement de la réponse
    if(response.ok) {
        const spanEtat = li.querySelector('.film-etat');
        li.dataset.vu = est_vu;

        if(est_vu === 1) {
            spanEtat.innerText = 'Vu';
            bouton.innerText = 'Marquer comme pas vu';
        }
        else {
            spanEtat.innerText = 'Pas vu';
            bouton.innerText = 'Marquer comme vu';
        }
    }
}

/**
 * Envoie une requête pour supprimer un film sur le serveur, puis le
 * retire de l'interface graphique.
 * @param {MouseEvent} event Évènement du clic sur le bouton.
 */
async function deleteFilmServeur(event) {
    // Préparation des données
    const data = {
        id_film: Number(event.currentTarget.dataset.idFilm)
    };

    // Envoi de la requête
    const response = await fetch('/api/film', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Traitement de la réponse
    if(response.ok) {
        listeFilms.querySelector(`li[data-id-film="${data.id_film}"]`).remove();
    }
}

// Code à exécuter au démarrage de la page
// Détection de la soumission du formulaire
formFilm.addEventListener('submit', addFilmServeur);

// Détection des clics sur les boutons des films déjà affichés
for(let bouton of boutonsVu) {
    bouton.addEventListener('click', updateFilmServeur);
}

for(let bouton of boutonsSupprimer) {
    bouton.addEventListener('click', deleteFilmServeur);
}
