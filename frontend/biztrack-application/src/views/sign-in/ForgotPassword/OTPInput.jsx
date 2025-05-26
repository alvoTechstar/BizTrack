import React from "react";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import "./forgotPassword.css";
import TitleHeader from "../../../components/Header/TitleHeader";
import TextInput from "../../../components/input/TextInput";
import FormButton from "../../../components/buttons/FormButton";
import TextButton from "../../../components/buttons/TextButton";
export default function OTPInput({
  input,
  action,
  isLoading,
  isLoadingResend,
  buttonAction,
  buttonAction2,
  back,
}) {
  return (
    <div className="reset-form-container">
      <TitleHeader
        icon={<EmailRoundedIcon />}
        title={"Check your Email"}
        subtitle={
          "An OTP for verification has been sent to your email, it will expire in 15 minutes"
        }
      />
      <div className="reset-form">
        <TextInput
          id={"code"}
          label={"Code"}
          placeholder={"Enter code"}
          input={input}
          handleInput={action}
          disabled={isLoading}
        />
        <TextButton
          text={"Didn't receive the code? "}
          actionText={"Resend"}
          alignment={"center"}
          isLoading={isLoadingResend}
          action={buttonAction2}
        />
        <FormButton
          text={"Validate"}
          isLoading={isLoading}
          validation={input}
          action={buttonAction}
        />
      </div>
      <TextButton
        actionText={"Back to Login"}
        alignment={"center"}
        action={back}
      />
    </div>
  );
}
