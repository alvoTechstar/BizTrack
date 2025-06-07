import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/Input/TextInput";
import PasswordInput from "../../components/Input/PasswordInput";
import FormButton from "../../components/Buttons/FormButton";
import NaviButton from "../../components/buttons/Navibutton";
import loginBg from "../../assets/Backgrounds/background.png";
import {
  validateEmail,
  validatePassword,
} from "../../utilities/Sharedfunctions";
import { MockUsers } from "../../config/Mockusers";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import ModalFooter from "../../components/footer/ModalFooter";

// Role normalization utility
const normalizeRole = (role) => {
  if (!role) return "";
  if (role.includes("-")) return role.toLowerCase();
  const [institution, roleName] = role.split("_");
  if (!institution || !roleName) {
    console.error("Invalid role format for normalization:", role);
    return "";
  }
  return `${institution.toLowerCase()}-${roleName.toLowerCase()}`;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if inputs are valid
  useEffect(() => {
    const valid =
      validateEmail(email) &&
      validatePassword("length", password) &&
      validatePassword("uppercase", password) &&
      validatePassword("number", password) &&
      validatePassword("characters", password);
    setIsValid(valid);
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    setLoading(true);
    setErrorMessage("");

    const matchedUser = MockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      const fullRole = normalizeRole(matchedUser.role);

      const userWithNormalizedRole = {
        ...matchedUser,
        role: fullRole,
      };

      Cookies.set("user", JSON.stringify(userWithNormalizedRole), {
        expires: 1,
      });

      dispatch(authActions.setAuth(userWithNormalizedRole));
      navigateToDashboard(fullRole);
    } else {
      setErrorMessage("Invalid email or password.");
    }

    setTimeout(() => setLoading(false), 1000);
  };

  // Navigate user to their specific dashboard
  const navigateToDashboard = (role) => {
    const normalizedRole = normalizeRole(role);

    const roleMap = {
      "biztrack-admin": "/dashboard/super-admin",
      "hotel-admin": "/dashboard/hotel-admin",
      "hotel-cashier": "/dashboard/cashier",
      "hotel-waiter": "/dashboard/waiter",
      "kiosk-admin": "/dashboard/kiosk",
      "kiosk-shopkeeper": "/dashboard/shopkeeper",
      "hospital-admin": "/dashboard/hospital-admin",
      "hospital-receptionist": "/patient/queue",
      "hospital-doctor": "/dashboard/doctor",
      "hospital-nurse": "/dashboard/nurse",
      "hospital-pharmacist": "/dashboard/pharmacist",
      "hospital-labtechnician": "/dashboard/labtechnician",
    };

    const path = roleMap[normalizedRole];
    if (path) {
      navigate(path);
    } else {
      console.warn("Unrecognized role:", normalizedRole);
      navigate("/unauthorized");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100 relative">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-6 relative z-10">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-300 w-full max-w-md mt-3">
          <h2 className="text-xl font-semibold mb-1 text-left">
            BizTrack Application
          </h2>
          <h1 className="text-3xl font-bold text-gray-700 mb-3 mt-3 text-left">
            Hello, Welcome
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-left">
            Enter credentials to login
          </p>

          <form onSubmit={handleSubmit}>
            <TextInput
              id="email"
              label="Username"
              placeholder="Enter your email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email !== "" && !validateEmail(email)}
              errorMessage="Please enter a valid email address."
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={password !== "" && !isValid}
              errorMessage="Password must be at least 7 characters, contain uppercase, number, and symbol."
            />

            {errorMessage && (
              <div className="text-red-600 text-sm mb-3">{errorMessage}</div>
            )}

            <div className="mt-10 mb-2">
              <FormButton
                text="Login"
                isLoading={loading}
                validation={isValid}
                type="submit"
              />
            </div>

            <div className="mt-3 mb-4 text-right">
              <NaviButton
                text="Forgot Password?"
                alignment="right"
                action={() => navigate("/reset-password")}
              />
            </div>
          </form>

          <div className="mt-8 mb-2 text-center">
            <ModalFooter />
          </div>
        </div>
      </div>

      {/* Right: Background image */}
      <div
        className="hidden lg:flex bg-cover bg-center h-full flex-col justify-end"
        style={{
          backgroundImage: `url(${loginBg})`,
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
        }}
      >
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mb-10">
          <span className="text-[#111827] font-bold text-xl p-3">
            Empower Your Business: Track Profits, Minimize Losses, Maximize
            Growth
          </span>
        </div>
      </div>

      {/* Mobile-only background */}
      <div
        className="lg:hidden sm:block absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      ></div>
    </div>
  );
};

export default Login;
