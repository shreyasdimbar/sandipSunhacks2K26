import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const queryTRACE = async (question) => {
  try {
    const response = await api.post('/api/query', { question });
    return response.data;
  } catch (error) {
    console.error('Error querying TRACE:', error);
    throw error;
  }
};

export const ingestData = async (payload) => {
  try {
    const response = await api.post('/api/ingest', payload);
    return response.data;
  } catch (error) {
    console.error('Error ingesting data:', error);
    throw error;
  }
};
