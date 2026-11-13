import { db } from '../db/db.js';

/**
 * Retourne tous les films de la base de données.
 * @returns La liste de tous les films.
 */
export async function getFilms() {
    const films = await db.all(
        `SELECT id_film, titre, genre, annee, note, est_vu
        FROM film`
    );

    return films;
}

/**
 * Ajoute un film dans la base de données. Un nouveau film n'est
 * jamais vu à sa création (est_vu vaut 0).
 * @param {string} titre Le titre du film.
 * @param {string} genre Le genre du film.
 * @param {number} annee L'année de sortie du film.
 * @param {number} note La note du film, de 1 à 5.
 * @returns L'identifiant du film ajouté.
 */
export async function addFilm(titre, genre, annee, note) {
    const resultat = await db.run(
        `INSERT INTO film(titre, genre, annee, note, est_vu)
        VALUES(?, ?, ?, ?, 0)`,
        [titre, genre, annee, note]
    );

    return resultat.lastID;
}

/**
 * Marque un film comme vu ou pas vu.
 * @param {number} id_film L'identifiant du film à modifier.
 * @param {number} est_vu 1 si le film est vu, 0 sinon.
 */
export async function updateFilmEstVu(id_film, est_vu) {
    await db.run(
        `UPDATE film
        SET est_vu = ?
        WHERE id_film = ?`,
        [est_vu, id_film]
    );
}

/**
 * Supprime un film de la base de données.
 * @param {number} id_film L'identifiant du film à supprimer.
 */
export async function deleteFilm(id_film) {
    await db.run(
        `DELETE FROM film
        WHERE id_film = ?`,
        [id_film]
    );
}
