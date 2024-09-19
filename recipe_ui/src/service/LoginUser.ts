import axios from 'axios';
import { AuthUser } from '../types/AuthUser';
export const LoginUser = async(user:AuthUser): Promise<boolean> =>{
    const {email,password} = user;
   
    const url = `https://localhost:7048/api/authservice/login`;
    try {
             const response = await axios.post(url,{email, password });
             localStorage.setItem('token', response.data.token);
             window.dispatchEvent(new Event('storage'));
             return true;

    } catch (error:any) {
        throw new Error(error?.response.data.status || "Failed to Login");
    }

}

