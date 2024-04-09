// public/js/main.js

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('link-button').addEventListener('click', async () => {
        // Call your server to get the link_token
        const linkTokenResponse = await fetch('/create_link_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const linkTokenData = await linkTokenResponse.json();
        const linkToken = linkTokenData.link_token;

        // Initialize Plaid Link with the link token
        const handler = Plaid.create({
            token: linkToken,
            onSuccess: async (public_token, metadata) => {
                // Send the public_token to your server with the /get_access_token endpoint
                const exchangeResponse = await fetch('/get_access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ public_token }),
                });
                const exchangeData = await exchangeResponse.json();
                // Handle success (e.g., display a message, redirect, etc.)
                console.log(exchangeData);
            },
            // ... Additional Plaid Link configuration ...
        });

        handler.open();
    });
});
