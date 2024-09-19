import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import "./Registration.css";
import {toast ,ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import chefImage from "../../asset/Images/Chef.png";
import { RegisterUser } from '../../service/RegisterUser';
import { User } from '../../types/User';
 
interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
 
const  Registration: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const history = useHistory();
 
 
  const validateName = (value: string, field: 'firstName' | 'lastName'): string | undefined => {
    if (!value.trim()) return "This field is required.";
    if (value.trim().length<3) return "must be at least 3 in length";
    if (/\d/.test(value)) return "Name should not contain numbers.";
    if (/[^a-zA-Z\s]/.test(value)) return "should not contain special chars";
    if (/[\s]/.test(value)) return "should not contain spaces";
    return undefined;
  };
 
  const handleNameChange = (value: string, field: 'firstName' | 'lastName') => {
    const update = field === 'firstName' ? setFirstName : setLastName;
    update(value);
    const errorMessage = validateName(value, field);
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };
  const validateEmail = (value: string): string | undefined => {
    value = value.trim();
    if (!value) return "Email is required.";
    if (/[\s]/.test(value)) return "Email should not contain spaces.";

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value)) {
        return "Email format is incorrect. Please use the format: john.doe@gmail.com";
    }
    const [localPart, domainPart] = value.split('@');
    const domainSections = domainPart.split('.');
    const topLevelDomain = domainSections.pop(); 
    const domainBody = domainSections.join('.'); 
    if (domainBody.length < 2 || domainBody.length > 10 ||
        /\d/.test(domainSections[0]) ||
        /^\d+$/.test(localPart) ||
        /^\d/.test(localPart) ||
        localPart.length < 6 || localPart.length > 30 ||
        (topLevelDomain && (/\d/.test(topLevelDomain) || topLevelDomain.length < 2 || topLevelDomain.length > 6))) {
        return "Email format is incorrect. Please use the format: john.doe@gmail.com";
    }
    if (/\.\.|^\.|^@|@$|\.$/.test(value)) {
        return "Email should not have leading, trailing, or consecutive dots.";
    }
    return undefined;
};
 
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const errorMessage = validateEmail(value);
    setErrors(prev => ({ ...prev, email: errorMessage }));
  };
 
  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required";
    if (/[\s]/.test(value)) return "should not contain spaces";
    if (value.length < 8 || value.length > 16) return "must be between 8 and 16 in length";
    if (!/[A-Z]/.test(value)) return "1 uppercase letter is required";
    if (!/[a-z]/.test(value)) return "1 lowercase letter is required";
    if (!/\d/.test(value)) return "must include at least 1 number";
    if (!/[@$!%*?&]/.test(value)) return "at least 1 special char is required";
    return undefined;
  };
 
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const errorMessage = validatePassword(value);
    setErrors(prev => ({ ...prev, password: errorMessage }));
  };
 
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    const errorMessage = value !== password ? "Passwords do not match." : undefined;
    setErrors(prev => ({ ...prev, confirmPassword: errorMessage }));
  };
 
  const isFormValid = () => {
    return (
      !errors.firstName && !errors.lastName && !errors.email &&
      !errors.password && !errors.confirmPassword &&
      firstName.trim() !== '' && lastName.trim() !== '' &&
      email.trim() !== '' && password.trim() !== '' &&
      confirmPassword.trim() !== ''
    );
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid()) {
      const user:User={
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password,
        confirmPassword:confirmPassword,
        
      }
    
    try {
      const isSuccess = await RegisterUser(user);
      if (isSuccess) {
        toast.success("Registration successful, Redirecting to login page");
        setTimeout(()=>{
          history.push({
            pathname: `/login`,
        });

        },4000)
        
      }
  } catch (error:any) {
    toast.error(`${error}`);
  }
    }
  };
 
  return (
    <div className="maincontainer">
      <img src={chefImage} alt="Chef" className="chefImage" />
      <div className="divs">
        <div className="loginContainer">
          <h2>Sign Up</h2>
          <form className="loginForm" onSubmit={handleSubmit}>
  <div className="fullName">
    <div className="formGroup">
      <label htmlFor="firstname">First Name</label>
      <input type="text" id="firstname" name="firstname" placeholder='e.g., John'
             value={firstName}
             onChange={(e) => handleNameChange(e.target.value, 'firstName')}
             onBlur={(e) => handleNameChange(e.target.value, 'firstName')} required />
      {errors.firstName && <p className="error">{errors.firstName}</p>}
    </div>
    <div className="formGroup">
      <label htmlFor="lastname">Last Name</label>
      <input type="text" id="lastname" name="lastname" placeholder='e.g., Doe'
             value={lastName}
             onChange={(e) => handleNameChange(e.target.value, 'lastName')}
             onBlur={(e) => handleNameChange(e.target.value, 'lastName')} required />
      {errors.lastName && <p className="error">{errors.lastName}</p>}
    </div>
  </div>
  <div className="formGroup">
    <label htmlFor="email">Email</label>
    <input type="email" id="email" name="email" placeholder='e.g:- john.doe@gmail.com'
           value={email}
           onChange={(e) => handleEmailChange(e.target.value)}
           onBlur={(e) => handleEmailChange(e.target.value)} required />
    {errors.email && <p className="error">{errors.email}</p>}
  </div>
  <div className="fullName">
    <div className="formGroup">
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" placeholder='********'
             value={password}
             onChange={(e) => handlePasswordChange(e.target.value)}
             onBlur={(e) => handlePasswordChange(e.target.value)} required />
      {errors.password && <p className="error">{errors.password}</p>}
    </div>
    <div className="formGroup">
      <label htmlFor="ConfirmPassword">Confirm Password</label>
      <input type="password" id="ConfirmPassword" name="ConfirmPassword" placeholder='********'
             value={confirmPassword}
             onChange={(e) => handleConfirmPasswordChange(e.target.value)}
             onBlur={(e) => handleConfirmPasswordChange(e.target.value)} required />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
    </div>
  </div>
  <div className="formGroupButton">
    <button type="submit" disabled={!isFormValid()}>Signup</button>
  </div>
</form>
          <div className="links">
            <span>Already have an account?</span>
            <Link to="/login" className="register-link">Login</Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
};
 
export default Registration;