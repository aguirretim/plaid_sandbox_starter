document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('link-button').addEventListener('click', handleLinkButtonClick);
});

async function handleLinkButtonClick() {
    try {
        const linkToken = await fetchLinkToken();
        if (!linkToken) return;

        const publicToken = await initiatePlaidLink(linkToken);
        if (!publicToken) return;

        const accessToken = await exchangePublicToken(publicToken);
        if (!accessToken) return;

        await fetchAccounts(accessToken);
        await fetchAuth(accessToken);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function fetchLinkToken() {
    const response = await fetch('/create_link_token', { method: 'POST' });
    if (!response.ok) {
        console.error('Failed to fetch the Link token:', response.statusText);
        return null;
    }
    const { link_token } = await response.json();
    if (!link_token) {
        console.error('Link token is missing in the response');
        return null;
    }
    return link_token;
}

async function initiatePlaidLink(linkToken) {
    return new Promise((resolve) => {
        const handler = Plaid.create({
            token: linkToken,
            onSuccess: (public_token) => {
                console.log('Public Token:', public_token);
                resolve(public_token);
            },
            onExit: (err) => {
                if (err) {
                    console.error('Plaid Link error:', err);
                    resolve(null);
                }
            },
        });
        handler.open();
    });
}

async function exchangePublicToken(publicToken) {
    const response = await fetch('/exchange_public_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken }),
    });
    if (!response.ok) {
        console.error('Error exchanging public token:', response.statusText);
        return null;
    }
    const { access_token } = await response.json();
    console.log('Access Token:', access_token);
    return access_token;
}

async function fetchAccounts(access_token) {
    const response = await makePlaidRequest('/accounts', { access_token });
    if (response) console.log('Accounts:', response);
}

async function fetchAuth(access_token) {
    const response = await makePlaidRequest('/auth', { access_token });
    if (response) console.log('Auth Information:', response);
}

async function makePlaidRequest(endpoint, body) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error(`Failed to fetch data from ${endpoint}:`, response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
    }
}
