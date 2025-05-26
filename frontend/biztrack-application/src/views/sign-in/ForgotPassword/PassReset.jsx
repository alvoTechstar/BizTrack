import React from "react";
import "./forgotPassword.css";
import TitleHeader from "../../../components/header/TitleHeader";
import FormButton from "../../../components/Buttons/FormButton";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import TextButton from "../../../components/Buttons/TextButton";
import PasswordResetInput from "../../../components/Input/PasswordResetInput";

export default function PassReset({
  input,
  input2,
  action,
  isLoading,
  buttonAction,
  back,
}) {
  return (
    <div className="reset-form-container">
      <TitleHeader
        icon={<LockRoundedIcon />}
        title={"Set new password"}
        subtitle={"Your new password must be different from previous passwords"}
      />
      <div className="reset-form">
        <PasswordResetInput
          id={"password"}
          label={"New Password"}
          placeholder={"Enter password"}
          input={input}
          id2={"passwordConfirm"}
          label2={"Confirm Password"}
          placeholder2={"Confirm password"}
          input2={input2}
          handleInput={action}
          loading={isLoading}
        />
        <FormButton
          text={"Reset Password"}
          isLoading={isLoading}
          validation={input && input2 && input === input2}
          action={buttonAction}
        />
      </div>
      <TextButton
        actionText={"Back to Login"}
        alignment={"center"}
        disabled={false}
        action={back}
      />
    </div>
  );
}
