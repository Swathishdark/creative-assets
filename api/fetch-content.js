const fetch = require('node-fetch');

const directusApiEndpoint = process.env.REACT_APP_DIRECTUS_URL;

module.exports = async (req, res) => {
  const { token } = req.query;

  console.log('Received request to fetch content');
  console.log('Directus API Endpoint:', directusApiEndpoint);
  console.log('Token:', token);

  if (!token) {
    console.error('Token is required');
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${directusApiEndpoint}/items/shareable_assets?filter[status][_eq]=published`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error(`Failed to fetch content: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Data received:', data);
    res.status(200).json(data.data);
  } catch (error) {
    console.error('Error fetching content:', error.message);
    res.status(500).json({ error: error.message });
  }
};
