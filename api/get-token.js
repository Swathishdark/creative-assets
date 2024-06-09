const fetch = require('node-fetch');

const directusApiEndpoint = process.env.REACT_APP_DIRECTUS_API_ENDPOINT;
const directusUsername = process.env.DIRECTUS_USERNAME;
const directusPassword = process.env.DIRECTUS_PASSWORD;

module.exports = async (req, res) => {
  console.log('Received request to get token');
  console.log('Directus API Endpoint:', directusApiEndpoint);
  console.log('Directus Username:', directusUsername);
  // Do not log the password for security reasons

  try {
    const response = await fetch(`${directusApiEndpoint}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: directusUsername,
        password: directusPassword,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error(`Failed to login: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Token received:', data.data.access_token);
    res.status(200).json({ token: data.data.access_token });
  } catch (error) {
    console.error('Error fetching access token:', error.message);
    res.status(500).json({ error: error.message });
  }
};
