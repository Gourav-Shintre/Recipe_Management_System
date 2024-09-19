import React, { useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";
import chefImage from "../../asset/Images/Chef.png";
import { AuthUser } from "../../types/AuthUser";
import { LoginUser } from "../../service/LoginUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Errors {
  email?: string;
  password?: string;
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "Email is required.";
  const parts = email.split("@");
  if (parts.length !== 2) return "Invalid email format.";

  const localPart = parts[0];
  const domainPart = parts[1];

  if (localPart.length < 6 || localPart.length > 30) {
    return "Email format is incorrect. Please use the format: john.doe@gmail.com";
  }
  if (domainPart.length < 2 || domainPart.length > 30) {
    return "Email format is incorrect. Please use the format: john.doe@gmail.com";
  }
  if (/^\d+$/.test(localPart)) {
    return "Email format is incorrect. Please use the format: john.doe@gmail.com";
  }
  if (!/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/.test(localPart)) {
    return "Email format is incorrect. Please use the format: john.doe@gmail.com";
  }

  if (!/^\w+([.-]?\w+)*(\.\w{2,3})+$/.test(domainPart)) {
    return "Email format is incorrect. Please use the format: john.doe@gmail.com";
  }

  if (/\d/.test(domainPart)) {
    return "Email format is incorrect. Please use the format: john.doe@gmail.com";
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < 8 || password.length > 16)
    return "Password must be 8-16 characters long";
  if (!/[A-Z]/.test(password))
    return "Password must include at least 1 uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must include at least 1 lowercase letter";
  if (!/\d/.test(password)) return "Password must include at least 1 number";
  if (!/[@$!%*?&]/.test(password))
    return "Password must include at least 1 special character";
  return undefined;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const history = useHistory();

  const handleInputChange = (field: "email" | "password", value: string) => {
    const newValue = value.trim();
    if (field === "email") {
      setEmail(newValue);
      setErrors((prev) => ({ ...prev, email: validateEmail(newValue) }));
    } else {
      setPassword(newValue);
      setErrors((prev) => ({ ...prev, password: validatePassword(newValue) }));
    }
  };

  const handleBlur = (field: "email" | "password"): void => {
    const value = field === "email" ? email : password;
    const validationResult =
      field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: validationResult }));
  };

  const isFormValid = (): boolean => {
    return (
      !errors.email &&
      !errors.password &&
      email.trim() !== "" &&
      password.trim() !== ""
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: AuthUser = { email, password };
    try {
      const isLoggedIn = await LoginUser(user);
      if (isLoggedIn) {
        history.push("/home");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="container1">
      <img src={chefImage} alt="Chef" className="chefImage" />
      <div className="divs1">
        <div className="loginContainer1">
          <h2>Sign in</h2>
          <form className="loginForm1" onSubmit={handleSubmit}>
            <div className="formGroup1">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="eg:- xyz@email.com"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                required
              />
              {errors.email && <p className="error1">{errors.email}</p>}
            </div>
            <div className="formGroup1">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                required
              />
              {errors.password && <p className="error1">{errors.password}</p>}
            </div>
            <div className="formgroup1">
              <button type="submit" disabled={!isFormValid()}>
                Login
              </button>
            </div>
          </form>
          <div className="links1">
            <span>New User?</span>
            <Link to="/registration" className="register-link1">
              Register
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
