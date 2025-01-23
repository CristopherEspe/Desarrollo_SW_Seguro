const express = require('express');
const path = require('path');
const multer = require('multer');

const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const session = require('express-session');
const dotenv = require('dotenv');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


dotenv.config();
const app = express();

// Configuración de la sesión
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}));

// Configuración de EJS y carpeta estática
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configuración de MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Configuración de multer para subir imágenes
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
});

// Rutas principales
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/dashboard', (req, res) => {
  if (!req.session.loggedin) return res.redirect('/login');
  db.query('SELECT * FROM images WHERE status = "pending"', (err, results) => {
    if (err) throw err;
    res.render('dashboard', { user: req.session.user, images: results });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0 && await bcrypt.compare(password, results[0].password_hash)) {
      req.session.loggedin = true;
      req.session.user = results[0];
      res.redirect('/dashboard');
    } else {
      res.send('Usuario o contraseña incorrecta');
    }
  });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send('Por favor, ingrese un nombre de usuario y una contraseña');
  }

  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.send('El nombre de usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hashedPassword], (err) => {
      if (err) throw err;
      res.send('Administrador creado con éxito');
    });
  });
});

// Subida de imágenes
app.get('/upload', (req, res) => {
  // Cualquier usuario puede acceder a esta ruta
  res.render('upload'); // Renderiza la vista para subir imágenes
});
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha enviado ningún archivo');
  }

  const filePath = req.file.path; // Ruta del archivo guardado

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('http://localhost:5000/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    // Aquí puedes guardar la información del archivo en la base de datos si es necesario

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al subir la imagen al servicio Python');
  }
});

app.get('/api/images', (req, res) => {
  db.query('SELECT id, filename, status FROM images', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener imágenes' });
    res.json(results);
  });
});

app.post('/approve/:id', (req, res) => {
  db.query('UPDATE images SET status = "approved" WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

app.post('/delete/:id', (req, res) => {
  db.query('DELETE FROM images WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));