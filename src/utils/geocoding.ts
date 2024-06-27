// geocoding.js
import axios from 'axios';

const API_KEY = 'AIzaSyC8zy45f-dWZWg0P4A9mGAZjNlMYTnJRvI';

export const getAddressFromCoordinates = async (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.results && response.data.results.length > 0) {
      // Modify to get less precise address information
      const addressComponents = response.data.results[0].address_components;
      let formattedAddress = '';

      // Construct a less precise address
      for (let i = 0; i < addressComponents.length; i++) {
        const type = addressComponents[i].types[0];
        if (
          type === 'locality' ||
          type === 'administrative_area_level_2' ||
          type === 'administrative_area_level_1' ||
          type === 'country'
        ) {
          formattedAddress += addressComponents[i].long_name + ', ';
        }
      }

      return formattedAddress.slice(0, -2); // Remove the last comma and space
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address';
  }
};
