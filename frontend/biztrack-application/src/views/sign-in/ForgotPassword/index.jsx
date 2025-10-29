import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import OTPRequest from "./OTPRequest";
import OTPInput from "./OTPInput";
import PassReset from "./PassReset";
import Toaster from "../../../components/Toaster";
import Footer from "../../../components/footer";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [toasterState, setToasterState] = useState("");
  const [toasterTitle, setToasterTitle] = useState("");
  const [toasterMessage, setToasterMessage] = useState("");
  const [view, setView] = useState(0); // 0: email, 1: OTP, 2: new password
  const [loading, setLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { id, value } = e.target;
    
    switch (id) {
      case "email":
        setEmail(value);
        break;
      case "code":
        setOTP(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "passwordConfirm":
        setPasswordConfirm(value);
        break;
      default:
        break;
    }
  };

  const handleToaster = (state, title, message) => {
    setShowToaster(true);
    setToasterState(state);
    setToasterTitle(title);
    setToasterMessage(message);
  };

  const handleSendOTP = async () => {
    if (!email) {
      handleToaster("false", "Error", "Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email
      });

      if (response.data.success) {
        handleToaster("true", "Success", "OTP sent to your email");
        setTimeout(() => {
          setView(1);
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send OTP";
      handleToaster("false", "Error", errorMsg);
      setLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    if (otp.length !== 6) {
      handleToaster("false", "Invalid OTP", "Please enter a 6-digit OTP");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, {
        email: email,
        otp: otp
      });
  
      if (response.data.success) {
        handleToaster("true", "Success", "OTP verified successfully");
        setResetToken(response.data.resetToken || otp);
        setTimeout(() => {
          setView(2);
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "OTP verification failed";
      handleToaster("false", "Verification Failed", errorMsg);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password !== passwordConfirm) {
      handleToaster("false", "Error", "Passwords do not match");
      return;
    }

    if (password.length < 12) {
      handleToaster("false", "Error", "Password must be at least 12 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email: email,
        resetToken: resetToken,
        newPassword: password,
        confirmPassword: passwordConfirm
      });

      if (response.data.success) {
        handleToaster("true", "Success", "Password reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Password reset failed";
      handleToaster("false", "Error", errorMsg);
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    navigate("/login");
  };

  const handleResendOTP = async () => {
    setLoadingOTP(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email
      });

      if (response.data.success) {
        handleToaster("true", "Success", "A new OTP has been sent to your email");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend OTP";
      handleToaster("false", "Error", errorMsg);
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleBackFromOTP = () => {
    setView(0);
    setOTP("");
  };

  const handleView = (active) => {
    switch (active) {
      case 1:
        return (
          <OTPInput
            input={otp}
            value={otp}
            isLoading={loading}
            isLoadingResend={loadingOTP}
            action={handleInput}
            buttonAction={handleValidateOTP}
            buttonAction2={handleResendOTP}
            back={handleBackFromOTP}
          />
        );
      case 2:
        return (
          <PassReset
            input={password}
            input2={passwordConfirm}
            isLoading={loading}
            action={handleInput}
            buttonAction={handleResetPassword}
            back={handleNavigation}
          />
        );
      default:
        return (
          <OTPRequest
            input={email}
            isLoading={loading}
            action={handleInput}
            buttonAction={handleSendOTP}
            back={handleNavigation}
          />
        );
    }
  };

  return (
    <div className="reset-container">
      <Toaster
        open={showToaster}
        state={toasterState}
        title={toasterTitle}
        message={toasterMessage}
        action={setShowToaster}
        position={"right"}
      />
      {handleView(view)}
      <Footer />
    </div>
  );
}