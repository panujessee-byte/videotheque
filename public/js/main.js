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

/**
 * Valide le titre et affiche un message d'erreur s'il est invalide.
 * @returns Vrai si le titre est valide.
 */
function validerTitre() {
    if(isTitreValide(inputTitre.value)) {
        erreurTitre.innerText = '';
        return true;
    }

    erreurTitre.innerText = 'Le titre est obligatoire.';
    return false;
}

/**
 * Valide le genre et affiche un message d'erreur s'il est invalide.
 * @returns Vrai si le genre est valide.
 */
function validerGenre() {
    if(isGenreValide(inputGenre.value)) {
        erreurGenre.innerText = '';
        return true;
    }

    erreurGenre.innerText = 'Le genre est obligatoire.';
    return false;
}

/**
 * Valide l'année et affiche un message d'erreur si elle est invalide.
 * @returns Vrai si l'année est valide.
 */
function validerAnnee() {
    if(isAnneeValide(Number(inputAnnee.value))) {
        erreurAnnee.innerText = '';
        return true;
    }

    erreurAnnee.innerText = 'L\'année doit être un nombre entier entre 1900 et 2026.';
    return false;
}

/**
 * Valide la note et affiche un message d'erreur si elle est invalide.
 * @returns Vrai si la note est valide.
 */
function validerNote() {
    if(isNoteValide(Number(inputNote.value))) {
        erreurNote.innerText = '';
        return true;
    }

    erreurNote.innerText = 'La note doit être un nombre entier entre 1 et 5.';
    return false;
}

/**
 * Ajoute un film dans la liste de la page.
 * @param {number} id_film L'identifiant du film.
 * @param {string} titre Le titre du film.
 * @param {string} genre Le genre du film.
 * @param {number} annee L'année de sortie du film.
 * @param {number} note La note du film.
 */
function afficherFilm(id_film, titre, genre, annee, note) {
    const li = document.createElement('li');
    li.classList.add('film');
    li.dataset.id = id_film;
    li.dataset.vu = 0;

    const divInfo = document.createElement('div');
    divInfo.classList.add('film-info');

    const h3 = document.createElement('h3');
    h3.innerText = titre;

    const p = document.createElement('p');
    p.innerText = genre + ' - ' + annee + ' - Note : ' + note + '/5';

    divInfo.append(h3);
    divInfo.append(p);

    const divActions = document.createElement('div');
    divActions.classList.add('film-actions');

    const spanEtat = document.createElement('span');
    spanEtat.classList.add('film-etat');
    spanEtat.innerText = 'Pas vu';

    const boutonVu = document.createElement('button');
    boutonVu.type = 'button';
    boutonVu.classList.add('film-vu');
    boutonVu.innerText = 'Marquer comme vu';

    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.type = 'button';
    boutonSupprimer.classList.add('film-supprimer');
    boutonSupprimer.innerText = 'Supprimer';

    divActions.append(spanEtat);
    divActions.append(boutonVu);
    divActions.append(boutonSupprimer);

    li.append(divInfo);
    li.append(divActions);

    boutonVu.addEventListener('click', modifierFilm);
    boutonSupprimer.addEventListener('click', supprimerFilm);

    listeFilms.append(li);
}

/**
 * Envoie le nouveau film au serveur, puis l'ajoute dans la page.
 * @param {SubmitEvent} event L'évènement de soumission du formulaire.
 */
async function ajouterFilm(event) {
    event.preventDefault();

    // Validation de tous les champs avant l'envoi
    const titreEstValide = validerTitre();
    const genreEstValide = validerGenre();
    const anneeEstValide = validerAnnee();
    const noteEstValide = validerNote();

    if(!titreEstValide || !genreEstValide || !anneeEstValide || !noteEstValide) {
        return;
    }

    const data = {
        titre: inputTitre.value,
        genre: inputGenre.value,
        annee: Number(inputAnnee.value),
        note: Number(inputNote.value)
    };

    const response = await fetch('/api/film', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        const film = await response.json();
        afficherFilm(film.id_film, data.titre, data.genre, data.annee, data.note);
        formFilm.reset();
    }
}

/**
 * Marque un film comme vu ou pas vu sur le serveur, puis met la
 * page à jour.
 * @param {MouseEvent} event L'évènement du clic sur le bouton.
 */
async function modifierFilm(event) {
    const bouton = event.currentTarget;
    const li = bouton.closest('.film');
    const spanEtat = li.querySelector('.film-etat');

    // Le nouvel état est l'inverse de l'état actuel
    let est_vu = 1;
    if(Number(li.dataset.vu) === 1) {
        est_vu = 0;
    }

    const data = {
        id_film: Number(li.dataset.id),
        est_vu: est_vu
    };

    const response = await fetch('/api/film', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
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
 * Supprime un film sur le serveur, puis le retire de la page.
 * @param {MouseEvent} event L'évènement du clic sur le bouton.
 */
async function supprimerFilm(event) {
    const li = event.currentTarget.closest('.film');

    const data = {
        id_film: Number(li.dataset.id)
    };

    const response = await fetch('/api/film', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        li.remove();
    }
}

// Évènements du formulaire d'ajout
formFilm.addEventListener('submit', ajouterFilm);
inputTitre.addEventListener('input', validerTitre);
inputGenre.addEventListener('input', validerGenre);
inputAnnee.addEventListener('input', validerAnnee);
inputNote.addEventListener('input', validerNote);

// Évènements des films déjà affichés par le serveur
const boutonsVu = document.querySelectorAll('.film-vu');
for(const bouton of boutonsVu) {
    bouton.addEventListener('click', modifierFilm);
}

const boutonsSupprimer = document.querySelectorAll('.film-supprimer');
for(const bouton of boutonsSupprimer) {
    bouton.addEventListener('click', supprimerFilm);
}
