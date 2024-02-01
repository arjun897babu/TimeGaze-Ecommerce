const axios = require('axios');

exports.allStates = async () => {
  try {

    const { data } = await axios.post(`https://countriesnow.space/api/v0.1/countries/states`, {
      country: 'India'
    });

    return data.data.states;

  } catch (error) {
    throw error
  }
}