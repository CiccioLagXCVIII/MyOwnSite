const mysql = require('mysql');
const util = require('util');
const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhh';

// Funzione per creare una connessione al database con metodi asincroni
async function makeDb(config) {
  const pool = mysql.createPool(config);

  // Funzione asincrona per ottenere la connessione
    const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
        });
    };

  // Ottieni la connessione
  const connection = await getConnection();
  console.log('Connessione Database Creata: ');


  // Restituisci l'oggetto database con i metodi asincroni
  return {
    // Esegui una query con promisify
    query: util.promisify(connection.query).bind(connection),
    // Rilascia la connessione
    connRelease: util.promisify(connection.release).bind(connection),
    // Inizia una transazione
    beginTransaction: util.promisify(connection.beginTransaction).bind(connection),
    // Esegui il commit di una transazione
    commit: util.promisify(connection.commit).bind(connection),
    // Esegui il rollback di una transazione
    rollback: util.promisify(connection.rollback).bind(connection),
    // Chiudi la connessione del pool
    end: pool.end.bind(pool),
  };
}

// Funzione asincrona per gestire una transazione generica
async function withTransaction(db, callback) {
  try {
    // Inizia la transazione
    await db.beginTransaction();
    // Esegui le operazioni CRUD
    await callback();
    // Esegui il commit della transazione
    await db.commit();
  } catch (err) {
    // In caso di errore, esegui il rollback
    await db.rollback();
    throw err;
  } finally {
    // Chiudi la connessione
    db.end();
  }
}

// Middleware di autorizzazione JWT
function withAuth(req, res, next) {
  // Ottieni il token dalla richiesta
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  // Verifica la presenza e validità del token
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        // Aggiungi l'email decodificata alla richiesta
        req.email = decoded.email;
        next();
      }
    });
  }
}

// Esporta le funzioni per l'uso in altri moduli
module.exports = {
  makeDb,
  withTransaction,
  withAuth,
};
