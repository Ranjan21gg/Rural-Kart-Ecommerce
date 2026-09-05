import api from './api';

export const chatWithAI = (message) =>
    api.post('/ai/chat/', 
        { message: message }
    );