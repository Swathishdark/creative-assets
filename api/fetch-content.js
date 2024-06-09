const fetch = require('node-fetch');

const directusApiEndpoint = process.env.REACT_APP_DIRECTUS_URL;

module.exports = async (req, res) => {
  const { token, program } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${directusApiEndpoint}/items/shareable_assets?filter[program_name][_contains]=${program}&filter[status][_eq]=published`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch content: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data.data);
  } catch (error) {
    console.error('Error fetching content:', error.message);
    res.status(500).json({ error: error.message });
  }
};
