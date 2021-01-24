import axios from "axios";

const apiRoute = `http://localhost:5000/api/v1/covid/info`;

export async function getCountryData(countryId) {
  const response = await axios.get(
      `${apiRoute}/countries/${countryId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
  );
  return response.data;
}