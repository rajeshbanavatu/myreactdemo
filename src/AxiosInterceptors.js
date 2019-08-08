import axios from 'axios';
import { getUser } from './Services/AuthService';

axios.interceptors.request.use(
    async (config) => {
        return getUser().then((user) => {
            if (user != null && user.access_token && !user.expired) {
                config.headers.Authorization = `Bearer ${user.access_token}`;
                return config;
            }
        }).catch((error) => {
            console.log(error);
        });
    }, (error) => {
        // Let the error bubble to the original call.
        return Promise.reject(error);
    }
);
