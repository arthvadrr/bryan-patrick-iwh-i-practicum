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
 * Homepage
 */
app.get('/', async (req, res) => {
	const url =
		'https://api.hubapi.com/crm/v3/objects/p_hockey_players?properties=name,goals,assists';

	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		'Content-Type': 'application/json',
	};
	try {
		const resp = await axios.get(url, { headers });
		console.log('HubSpot API response:', JSON.stringify(resp.data, null, 2));
		const data = resp.data.results || [];
		res.render('homepage', { title: 'Hockey Players', data });
	} catch (error) {
		console.error('HubSpot API error:', error?.response?.data || error);
		res.render('homepage', { title: 'Hockey Players', data: [] });
	}
});

/**
 * Render form to create/update custom object
 */
app.get('/update-cobj', (req, res) => {
	res.render('updates', {
		title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
	});
});

/**
 * Create or update hockey player
 */
app.post('/update-cobj', async (req, res) => {
	const { id, name } = req.body;
	const goals = Number(req.body.goals) || 0;
	const assists = Number(req.body.assists) || 0;
	const baseUrl = 'https://api.hubapi.com/crm/v3/objects/p_hockey_players';
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
		'Content-Type': 'application/json',
	};
	const playerData = {
		properties: { name, goals, assists },
	};
	try {
		if (id) {
			/**
			 * We have an id, update record
			 */
			await axios.patch(`${baseUrl}/${id}`, playerData, { headers });
		} else {
			/**
			 * No id, create new record
			 */
			await axios.post(baseUrl, playerData, { headers });
		}
		res.redirect('/');
	} catch (error) {
		console.error(error?.response?.data || error);
		res.redirect('/update-cobj');
	}
});

/**
 * Localhost
 */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
