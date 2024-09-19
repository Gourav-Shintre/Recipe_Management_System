import axios from 'axios';
import { User } from '../types/User';

export const RegisterUser = async(user:User)=>{
    const url = `https://localhost:7048/api/authservice/auth/register`;
    try {
        const response = await axios.post(url, user);
       return response.data;

    } catch (error:any) {
        console.error("Failed to Register User", error.response.data);
        throw new Error(error?.response.data || "Failed to register user.");
    }
}
