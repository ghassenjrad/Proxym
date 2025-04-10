import axios from 'axios'

const  api_url = 'http://localhost:3000';

export const login = (email, password) => {
    return axios.post(`${api_url}/auth/login`, { email, password});
};

