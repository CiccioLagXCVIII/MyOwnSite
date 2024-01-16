const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const saltRounds = 10;
const secret = 'mysecretsshhh';
const cookieParser = require('cookie-parser');

// Middleware Database
const { config } = require('./Database/Config');
const { makeDb, withTransaction, withAuth } = require('./Database/MiddlewareDatabase');

const bodyParser = require('body-parser');
var cors = require('cors');

// Parsing middleware
// Configura CORS
app.use(cors({
  origin: 'http://localhost:3000', // Sostituisci con l'indirizzo del tuo frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Aggiungi eventuali altri header personalizzati necessari
}));

{/*app.use((req, res, next) => {
  console.log('Request from:', req.headers.origin);
  console.log('CORS Headers:', req.headers['access-control-request-headers']);
  next();
});*/}

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());
app.use(cookieParser());

// Listen on environment port or 5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));



//-------------------------------------------------------------------------------------------------------------------//



// Middleware per verificare il token durante le richieste protette
// Funzione per verificare il token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // Se il token non è presente, restituisci un errore di accesso non autorizzato
  if (!token) {
    res.status(401).send('Accesso non autorizzato');
  } else {
    // Verifica il token utilizzando la chiave segreta
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        // Se la verifica fallisce, restituisci un errore di token non valido
        res.status(401).send('Token Non Valido!');
      } else {
        // Se la verifica è riuscita, aggiungi l'email ai dati della richiesta e passa al prossimo middleware
        req.email = decoded.email;
        console.log('verifyToken: ', req.email);
        next();
      }
    });
  }
};


app.get('/', function (req, res) {
    res.send("Tutto Funziona LMAO");
});
app.get('/registrazione', function (req, res) {
  res.send("Registrazione");
});
app.get('/login', function (req, res) {
  res.send("Login");
});


// Middleware Registrazione
app.post('/registrazione', async (req, res) => {
  const { nome, cognome, email, password } = req.body;
  const database = await makeDb(config);

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Controlla se l'email è già registrata
    const existingUser = await database.query('SELECT * FROM Utenti WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      console.log(`Email ${email} già registrata`);
      return res.status(409).send('Email già registrata');
    }

    // Esegue la transazione
    await withTransaction(database, async () => {
      const query = 'INSERT INTO Utenti (nome, cognome, email, password) VALUES (?, ?, ?, ?)';
      await database.query(query, [nome, cognome, email, hashedPassword]);

      console.log('Dati inseriti nel database con successo');
      res.status(200).send('Registrazione avvenuta con successo');
    });
  } catch (error) {
    console.error('Errore durante l\'hashing della password o l\'inserimento nel database:', error);
    res.status(500).send('Errore durante la registrazione');
  }
});


// Middleware Login
app.post('/login', async (req, res, next) => {
  const database = await makeDb(config);
  try {
    await withTransaction(database, async () => {
      // Estrai email e psw dal corpo della richiesta
      const { email, password } = req.body;
      // Ricerca dell'utente nella tabella 'utenti'
      const results = await database.query('SELECT * FROM `utenti` WHERE email = ?', [email]);

      // Verifica se l'utente è stato trovato
      if (results.length === 0) {
        console.log('Utente non trovato!');
        return res.status(404).send('Utente non trovato');
      }

      // Confronto tra la password fornita e quella nel database utilizzando bcrypt
      const passwordMatch = await bcrypt.compare(password, results[0].password);

      if (!passwordMatch) {
        console.log('Password errata!');
        return res.status(403).send('Password errata');
      }

      // Autenticazione riuscita
      console.log('Utente autenticato');
      const id_utente = results[0].user_id;

      // Creazione del token JWT
      const payload = { email, id_utente };
      const token = jwt.sign(payload, secret, { expiresIn: '5h' });
      //console.log('Token: ', token, " Dell' Utente: ", id_utente);
      
      // Salvataggio del token nei cookie
      res.cookie('token', token, { httpOnly: true });
      console.log('Cookie impostato correttamente');

      // Invio della risposta JSON con il token e l'id_utente
      res.status(200).json({ token, id_utente });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Rotta per verificare l'autenticazione
app.get('/checkAuth', verifyToken, (req, res) => {
  // Se il token è valido, l'utente è autenticato
  res.status(200).send({ authenticated: true, email: req.email });
});