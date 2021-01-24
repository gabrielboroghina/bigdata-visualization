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

export async function getAll() {
  const response = await axios.get(
      `${apiRoute}/countries`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
  );
  return response.data;
}

export async function getCountryByAgeGroups(countryId) {
  const response = await axios.get(
      `${apiRoute}/countries/ages/${countryId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
  );
  return response.data;
}