// Fonctions de validation réutilisables. Elles sont utilisées par
// le client (public/js/main.js) et par le serveur
// (middlewares/validation.js).

/**
 * Valide l'identifiant d'un film.
 * @param {number} id_film L'identifiant à valider.
 * @returns Vrai si l'identifiant est un nombre entier plus grand que 0.
 */
export function isIdFilmValide(id_film) {
    return typeof id_film === 'number' &&
        Number.isInteger(id_film) &&
        id_film > 0;
}

/**
 * Valide le titre d'un film.
 * @param {string} titre Le titre à valider.
 * @returns Vrai si le titre est une chaîne de caractères non vide.
 */
export function isTitreValide(titre) {
    return typeof titre === 'string' &&
        titre.trim() !== '';
}

/**
 * Valide le genre d'un film.
 * @param {string} genre Le genre à valider.
 * @returns Vrai si le genre est une chaîne de caractères non vide.
 */
export function isGenreValide(genre) {
    return typeof genre === 'string' &&
        genre.trim() !== '';
}

/**
 * Valide l'année de sortie d'un film.
 * @param {number} annee L'année à valider.
 * @returns Vrai si l'année est un nombre entier entre 1900 et 2026.
 */
export function isAnneeValide(annee) {
    return typeof annee === 'number' &&
        Number.isInteger(annee) &&
        annee >= 1900 &&
        annee <= 2026;
}

/**
 * Valide la note d'un film.
 * @param {number} note La note à valider.
 * @returns Vrai si la note est un nombre entier entre 1 et 5.
 */
export function isNoteValide(note) {
    return typeof note === 'number' &&
        Number.isInteger(note) &&
        note >= 1 &&
        note <= 5;
}

/**
 * Valide l'état "vu" d'un film.
 * @param {number} est_vu L'état à valider.
 * @returns Vrai si l'état est 0 ou 1.
 */
export function isEstVuValide(est_vu) {
    return est_vu === 0 || est_vu === 1;
}
