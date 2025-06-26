import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

/**
 * Render form to create/update custom object
 */
app.get('/update-cobj', (req, res) => {
	res.render('updates', { title: 'Create/Update Custom Object' });
});

/**
 * Homepage
 */
app.get('/', async (req, res) => {
	const url =
		'https://api.hubapi.com/crm/v3/objects/hockey_player?properties=first_name,last_name,team';
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		'Content-Type': 'application/json',
	};
	try {
		const resp = await axios.get(url, { headers });
		const data = resp.data.results || [];
		res.render('homepage', { title: 'Hockey Players', data });
	} catch (error) {
		console.error(error);
		res.render('homepage', { title: 'Hockey Players', data: [] });
	}
});

/**
 * Handle form submission
 */
app.post('/update-cobj', async (req, res) => {
	const url = 'https://api.hubapi.com/crm/v3/objects/hockey_player';
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		'Content-Type': 'application/json',
	};
	const newPlayer = {
		properties: {
			name: req.body.name,
			goals: req.body.goals,
			assists: req.body.assists,
		},
	};
	try {
		await axios.post(url, newPlayer, { headers });
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.redirect('/update-cobj');
	}
});

/**
 * Localhost
 */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
