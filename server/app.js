// server/app.js

require('dotenv').config({ path: '../.env' });
const express = require('express');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const app = express();
const port = process.env.PORT || 3000;

// Make sure these environment variables are correctly named and present in your .env file
const clientID = process.env.PLAID_CLIENT_ID;
const secret = process.env.PLAID_SECRET;

// Check if the environment variables have been loaded correctly
if (!clientID || !secret) {

    console.error('Missing required environment variables. Check your .env file.');
    process.exit(1); // Exit the process if the environment variables are not set
}


// Initialize Plaid client
const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox, // Use the appropriate environment here
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': clientID,
            'PLAID-SECRET': secret,
            // Add 'Plaid-Version': '2020-09-14' if required for your use case
        },
    },
});

// Initialize Plaid client
const plaidClient = new PlaidApi(configuration);

// Serve static files from 'public' directory
app.use(express.static('public'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Create Link token
app.post('/create_link_token', async (req, res) => {
    try {
        const response = await plaidClient.createLinkToken({
            user: {
                client_user_id: clientID, // Replace with actual unique id if available
            },
            client_name: 'Plaid Quickstart App',
            products: ['transactions'],
            country_codes: ['US'],
            language: 'en',
        });
        res.json({ link_token: response.link_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exchange public token for access token
app.post('/get_access_token', async (req, res) => {
    const publicToken = req.body.public_token;
    try {
        const response = await plaidClient.exchangePublicToken(publicToken);
        const accessToken = response.access_token;
        // Here you should save the accessToken in a secure, persistent database associated with the user
        res.json({ access_token: accessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
