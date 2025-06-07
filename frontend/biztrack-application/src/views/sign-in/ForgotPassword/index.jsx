import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import OTPRequest from "./OTPRequest";
import OTPInput from "./OTPInput";
import PassReset from "./PassReset";
import TitleHeader from "../../../components/header/TitleHeader";
import Toaster from "../../../components/Toaster";
import { getEncryptValue } from "../../../utilities/Sharedfunctions";
import { POST_LOGIN, PUT_LOGIN } from "../../../services/DatabaseServiceImp";
// import URLS from "../../../utilities/Endpoints";
import Footer from "../../../components/footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [toasterState, setToasterState] = useState("");
  const [toasterTitle, setToasterTitle] = useState("");
  const [toasterMessage, setToasterMessage] = useState("");
  const [view, setView] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
    }

    if (e.target.id === "code") {
      setOTP(e.target.value);
    }

    if (e.target.id === "password") {
      setPassword(e.target.value);
      setPasswordConfirm("");
    }
    if (e.target.id === "passwordConfirm") {
      setPasswordConfirm(e.target.value);
    }
  };

  const handleToaster = (state, title, message) => {
    setLoading(false);
    setLoadingOTP(false);
    setShowToaster(true);
    setToasterState(state);
    setToasterTitle(title);
    setToasterMessage(message);
  };

  const handleSendOTP = async () => {
    let payload = { email: email };

    setLoading(true);
    let request = await POST_LOGIN(
      "", // Placeholder API endpoint
      payload
    );

    if (request.success) {
      handleToaster("true", "Password Reset", "OTP sent to your email");
      setTimeout(() => {
        setView(1);
      }, 3000);
    } else {
      handleToaster(
        "false",
        "Password Reset",
        request.message ? request.message : ""
      );
    }
  };

  const handleValidateOTP = async () => {
    let payload = { email: email, secret: getEncryptValue(otp) };

    setLoading(true);
    let request = await POST_LOGIN(
      "", // Placeholder API endpoint
      payload
    );

    if (request.success) {
      handleToaster("true", "Password Reset", "OTP validated successfully");
      setTimeout(() => {
        setView(2);
      }, 4000);
    } else {
      handleToaster(
        "false",
        "Password Reset",
        request.message ? request.message : ""
      );
    }
  };

  const handleResetPassword = async () => {
    let payload = {
      email: email,
      currentSecret: "",
      newSecret: getEncryptValue(password),
    };

    setLoading(true);
    let request = await PUT_LOGIN(
      "", // Placeholder API endpoint
      payload
    );

    if (request.success) {
      handleToaster(
        "true",
        "Password Reset",
        "Your password was reset successfully"
      );
      setTimeout(() => {
        handleNavigation();
      }, 4000);
    } else {
      handleToaster(
        "false",
        "Password Reset",
        request.message ? request.message : ""
      );
    }
  };

  const handleNavigation = () => {
    navigate("/");
  };

  const handleView = (active) => {
    switch (active) {
      case 1:
        return (
          <OTPInput
            input={otp}
            isLoading={loading}
            isLoadingResend={loadingOTP}
            action={handleInput}
            buttonAction={handleValidateOTP}
            buttonAction2={handleSendOTP}
            back={handleNavigation}
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
      <TitleHeader />
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
