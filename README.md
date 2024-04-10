# Plaid Quickstart Integration

This project demonstrates a basic integration with the Plaid API, enabling users to link their bank accounts securely and fetch account and authentication data. It utilizes the Plaid Link flow to generate a `link_token`, exchange it for a `public_token`, and finally obtain an `access_token` to fetch account details and authentication information.

## Technologies Used

- Node.js
- Express
- Plaid SDK

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- A Plaid account and access to your Plaid API keys.

### Installation

 1. Navigate to the project directory:

    cd plaid-quickstart-integration

 2. Install the required dependencies:

    npm install

 3. Create a .env file in the root of your project and populate it with
    your Plaid credentials:

    PLAID_CLIENT_ID=your_client_id_here
    PLAID_SECRET=your_secret_here
    PORT=3000 # Optional: change if you want to use a different port

 4. Start the server:

    npm start



 1. Navigate to the project directory:

    cd plaid-quickstart-integration

 2. Install the required dependencies:

    npm install

 3. Create a .env file in the root of your project and populate it with
    your Plaid credentials:

    PLAID_CLIENT_ID=your_client_id_here
    PLAID_SECRET=your_secret_here
    PORT=3000 # Optional: change if you want to use a different port

 4. Start the server:

    npm start

Your server should now be running on http://localhost:3000 (or another port if you specified one).

## Usage

 Visit http://localhost:3000 in your web browser. Click on the "Link Account" button and follow the Plaid Link flow to link a bank account. Once an account is linked, the server fetches and displays the account and authentication data.

## License

This project is open source and available under the MIT License.
