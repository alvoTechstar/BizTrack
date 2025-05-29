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
import { MockUsers } from "../../config/Mockusers"; // Assuming your MockUsers is here
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { authActions } from "../../store"; // Assuming authActions is exported from ./store/index.js
import ModalFooter from "../../components/footer/ModalFooter";

// Ensure normalizeRole is defined or imported here if it's not global
const normalizeRole = (role) => {
  if (!role) return "";
  if (role.includes("-")) {
    // Already normalized
    return role.toLowerCase();
  }
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
      // The role stored in MockUsers is like "Hotel_Admin"
      // The role in the cookie/Redux should be normalized "hotel-admin"
      const fullRole = normalizeRole(matchedUser.role);
      // Ensure the associatedBusinessId is part of the user object
      const userWithNormalizedRole = {
        ...matchedUser,
        role: fullRole,
        // Make sure associatedBusinessId is present in MockUsers directly.
        // If it's not, you'd need to find it here, e.g.,
        // associatedBusinessId: mockBusinesses.find(b => b.type === 'Hotel')?.id, // This is too generic
        // It's crucial that MockUsers directly contains associatedBusinessId.
        // (As per our `mockData.js` update, it should be there)
      };

      console.log(
        "User with Normalized Role and Business ID:",
        userWithNormalizedRole
      );

      Cookies.set("user", JSON.stringify(userWithNormalizedRole), {
        expires: 1,
      });
      dispatch(authActions.setAuth(userWithNormalizedRole)); // This triggers theme update
      navigateToDashboard(fullRole);
    } else {
      setErrorMessage("Invalid email or password.");
    }

    setTimeout(() => setLoading(false), 1000);
  };

  const navigateToDashboard = (role) => {
    const normalizedRole = normalizeRole(role); // ensure consistent normalization

    const roleMap = {
      "biztrack-admin": "/dashboard/super-admin",
      "hotel-admin": "/dashboard/hotel-admin",
      "hotel-cashier": "/dashboard/cashier",
      "hotel-waiter": "/dashboard/waiter",
      "kiosk-admin": "/dashboard/kiosk",
      "kiosk-shopkeeper": "/dashboard/shopkeeper",
      "hospital-admin": "/dashboard/hospital-admin",
      "hospital-receptionist": "/dashboard/receptionist",
      "hospital-doctor": "/dashboard/doctor",
      "hospital-nurse": "/dashboard/nurse",
      "hospital-pharmacist": "/dashboard/pharmacist",
      "hospital-labtechnician": "/dashboard/labtechnician",
    };

    console.log("Looking for role:", normalizedRole);
    console.log("Available paths:", roleMap);

    const path = roleMap[normalizedRole];

    if (path) {
      navigate(path);
    } else {
      console.warn("Unrecognized role:", normalizedRole);
      navigate("/unauthorized"); // Redirect to unauthorized page
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">
      <div className="flex items-center justify-center p-6 relative z-10">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-500 w-full max-w-md mt-3">
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
