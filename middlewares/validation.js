import {
    isIdFilmValide,
    isTitreValide,
    isGenreValide,
    isAnneeValide,
    isNoteValide,
    isEstVuValide
} from '../public/js/validation.js';

// Middlewares de route pour la validation. Chaque middleware valide
// un champ du corps de la requête (body). Si le champ est valide, on
// passe au prochain middleware. Sinon, on répond avec le code 400.

export function idFilmValide(request, response, next) {
    if(isIdFilmValide(request.body.id_film)) {
        return next();
    }

    response.status(400).end();
}

export function titreValide(request, response, next) {
    if(isTitreValide(request.body.titre)) {
        return next();
    }

    response.status(400).end();
}

export function genreValide(request, response, next) {
    if(isGenreValide(request.body.genre)) {
        return next();
    }

    response.status(400).end();
}

export function anneeValide(request, response, next) {
    if(isAnneeValide(request.body.annee)) {
        return next();
    }

    response.status(400).end();
}

export function noteValide(request, response, next) {
    if(isNoteValide(request.body.note)) {
        return next();
    }

    response.status(400).end();
}

export function estVuValide(request, response, next) {
    if(isEstVuValide(request.body.est_vu)) {
        return next();
    }

    response.status(400).end();
}
