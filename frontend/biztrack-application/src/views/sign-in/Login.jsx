import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/input/TextInput";
import PasswordInput from "../../components/input/PasswordInput";
import FormButton from "../../components/buttons/FormButton";
import NaviButton from "../../components/buttons/Navibutton";
import Logo from "../../assets/Logos/isw.png";
import loginBg from "../../assets/Backgrounds/login.png";
import { validateEmail, validatePassword } from "../../utilities/Sharedfunctions";
import { MockUsers } from "../../config/Mockusers";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";

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
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      Cookies.set("user", JSON.stringify(matchedUser), { expires: 1 });
      dispatch(authActions.setAuth(matchedUser));

      switch (matchedUser.role) {
        case "Super Admin":
          navigate("/dashboard");
          break;
        case "Hotel Admin":
          navigate("/sales");
          break;
        case "Cashier":
          navigate("/dashboard/cashier");
          break;
        default:
          navigate("/");
      }
    } else {
      setErrorMessage("Invalid email or password.");
    }

    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">
      <div className="flex items-center justify-center p-6 relative z-10">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">BizTrack</h1>
          <h3 className="text-sm text-center text-gray-600 mb-6">
            Enter credentials to login
          </h3>

          <form onSubmit={handleSubmit}>
            <TextInput
              id="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email !== "" && !validateEmail(email)}
              errorMessage={"Please enter a valid email address."}
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={password !== "" && !isValid}
              errorMessage={
                "Password must be at least 7 characters, contain uppercase, number, and symbol."
              }
            />

            {errorMessage && (
              <div className="text-red-600 text-sm mb-3">{errorMessage}</div>
            )}

            <div className="mt-1 mb-4">
              <NaviButton
                text="Forgot Password?"
                alignment="right"
                action={() => navigate("/reset-password")}
              />
            </div>

            {/* Submit button should NOT call action={handleSubmit}, because the form handles it */}
            <FormButton
              text="Login"
              isLoading={loading}
              validation={isValid}
              type="submit" // Ensure it's a submit button
            />
          </form>

          <div className="mt-8 text-center">
            <img src={Logo} alt="BizTrack Logo" className="h-10 mx-auto" />
          </div>
        </div>
      </div>

      {/* Background Image Section */}
      <div
        className="hidden lg:flex bg-cover bg-center h-full flex-col justify-end"
        style={{
          backgroundImage: `url(${loginBg})`,
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
        }}
      >
        <div className="bg-white-100 p-6 rounded-xl shadow-md max-w-md mx-auto mb-10">
          <span className="text-[#111827] font-bold text-xl p-3">
            Empower Your Business: Track Profits, Minimize Losses, Maximize Growth
          </span>
        </div>
      </div>

      {/* Mobile Background Image */}
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
