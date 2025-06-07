import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TextInput from "../../../components/Input/TextInput";
import PasswordInput from "../../../components/Input/PasswordInput";
import AppFormButton from "../../../components/buttons/AppFormButton";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "../../../components/theme/ThemeContext";

const MyProfile = ({ onClose }) => {
  const { primaryColor } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [originalUserData, setOriginalUserData] = useState(null);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  useEffect(() => {
    const storedRaw = Cookies.get("user");
    if (!storedRaw) return;

    try {
      const storedUser = JSON.parse(storedRaw);
      if (!storedUser?.role) return;

      setOriginalUserData(storedUser);

      const roleToSplit = storedUser.role.includes("_")
        ? storedUser.role
        : storedUser.role.replace("-", "_");

      const [institution, ...rest] = roleToSplit.split("_");
      const derivedLastName = rest.join("_");

      setFirstName(institution || "");
      setLastName(derivedLastName || "");
      setInstitution(institution || "");
      setRole(storedUser.role || "");
      setEmail(storedUser.email || "");
      setUserName(storedUser.name || "");
      setPhoneNumber(storedUser.phoneNumber || "");
      setPassword(storedUser.password || "");
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleSaveChanges = async () => {
    setIsLoadingSave(true);
    console.log("Saving changes...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const storedRaw = Cookies.get("user");
    if (!storedRaw) {
      setIsLoadingSave(false);
      return;
    }

    try {
      const storedUser = JSON.parse(storedRaw);
      const updatedUser = {
        ...storedUser,
        password: password,
        phoneNumber: phoneNumber,
      };
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
      console.log("Changes saved successfully");
      setOriginalUserData(updatedUser);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      if (onClose) {
        onClose();
      }
      setIsLoadingSave(false);
    }
  };

  const handleCancelChanges = async () => {
    setIsLoadingCancel(true);
    console.log("Cancelling changes...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (originalUserData) {
      setPhoneNumber(originalUserData.phoneNumber || "");
      setPassword(originalUserData.password || "");
    }
    if (onClose) {
      onClose();
    }
    setIsLoadingCancel(false);
  };

  const handleCloseProfile = () => {
    console.log("Closing profile directly...");
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="
        p-4 sm:p-6
        md:mx-auto md:max-w-3xl
        lg:max-w-4xl
        bg-white rounded-lg shadow-md mb-8
      "
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
        <IconButton
          aria-label="close"
          onClick={handleCloseProfile}
          sx={{
            size: "small",
            backgroundColor: primaryColor,
            color: "#fff",
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: 0.9,
            },
            "& .MuiSvgIcon-root": {
              fontSize: "0.9rem",
            },
          }}
          disabled={isLoadingSave || isLoadingCancel}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        You can only edit your phone number and change your password.
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput label="First Name" value={firstName} disabled />
        <TextInput label="Last Name" value={lastName} disabled />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput label="Institution" value={institution} disabled />
        <TextInput label="Role" value={role} disabled />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={isLoadingSave || isLoadingCancel}
        />
        <TextInput label="Email Address" value={email} disabled />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoadingSave || isLoadingCancel}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoadingSave || isLoadingCancel}
        />
      </div>
      <div className="flex gap-4">
        <AppFormButton
          text="Cancel"
          color="invert"
          isLoading={isLoadingCancel}
          validation={true}
          action={handleCancelChanges}
          disabled={isLoadingSave}
        />
        <AppFormButton
          text="Save Changes"
          color={primaryColor || "#1f2937"}
          isLoading={isLoadingSave}
          validation={password.length > 6 && !isLoadingCancel}
          action={handleSaveChanges}
          disabled={isLoadingCancel}
        />
      </div>
    </div>
  );
};

export default MyProfile;
