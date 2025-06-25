import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

/**
 * Homepage
 */
app.get('/', (req, res) => {
	res.render('custom_objects', { title: 'Custom Objects', data: [] });
});

/**
 * Render form to create/update custom object
 */
app.get('/update-cobj', (req, res) => {
	res.render('updates', { title: 'Create/Update Custom Object' });
});

/**
 * Handle form submission
 */
app.post('/update-cobj', (req, res) => {
	res.redirect('/');
});

/**
 * Localhost
 */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
