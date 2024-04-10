require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
const port = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Plaid client initialization
const clientID = process.env.PLAID_CLIENT_ID;
const secret = process.env.PLAID_SECRET;
const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': clientID,
            'PLAID-SECRET': secret,
        },
    },
});
const plaidClient = new PlaidApi(configuration);

// Routes
app.post('/create_link_token', async (req, res) => {
    // Generate a unique client_user_id using UUID
    const clientUserId = uuidv4();

    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: clientUserId },
            client_name: 'Tims Plaid App',
            products: ['transactions'],
            country_codes: ['US'],
            language: 'en',
        });
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.response.data });
    }
});

app.post('/exchange_public_token', async (req, res) => {
    try {
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({ public_token: req.body.public_token });
        res.json({ access_token: exchangeResponse.data.access_token });
    } catch (error) {
        console.error('Error exchanging public token:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/accounts', async (req, res) => {
    try {
        const accountsResponse = await plaidClient.accountsGet({ access_token: req.body.access_token });
        res.json(accountsResponse.data);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: error.response.data });
    }
});

app.post('/auth', async (req, res) => {
    try {
        const authResponse = await plaidClient.authGet({ access_token: req.body.access_token });
        res.json(authResponse.data);
    } catch (error) {
        console.error('Error fetching auth information:', error);
        res.status(500).json({ error: error.response.data });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
