
import axios from "axios";
import axiosInstance from "./axiosinstance";



export const login = (data: {username: string, password: string }) =>{
    return axios.post('http://localhost:3000/api/auth/login',data)
} 

export const registerApi = (data: { email: string, username: string, password: string}) =>{
    return axiosInstance.post('/auth/register', data);
};

export const getUserListApi = () =>{
    return axiosInstance.get('/user/list');
};

export const searchUsersApi = (query: string) =>{
    return axiosInstance.get(`/user/search?u=${encodeURIComponent(query)}`);
};

