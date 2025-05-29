import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TextInput from "../../../components/Input/TextInput";
import PasswordInput from "../../../components/Input/PasswordInput";
import AppFormButton from "../../../components/buttons/AppFormButton";
const MyProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedRaw = Cookies.get("user");
    if (!storedRaw) return;

    try {
      const storedUser = JSON.parse(storedRaw);
      if (!storedUser?.role) return;

      // Handle both original and normalized roles
      const roleToSplit = storedUser.role.includes("_")
        ? storedUser.role
        : storedUser.role.replace("-", "_");

      const [institution, ...rest] = roleToSplit.split("_");
      const lastName = rest.join("_");

      setFirstName(institution || "");
      setLastName(lastName || "");
      setInstitution(institution || "");
      setRole(storedUser.role || "");
      setEmail(storedUser.email || "");
      setPhoneNumber(storedUser.phoneNumber || "");
      setPassword(storedUser.password || "");
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleSaveChanges = () => {
    console.log("Saving changes...");
    // Get current user data from cookies
    const storedRaw = Cookies.get("user");
    if (!storedRaw) return;

    try {
      const storedUser = JSON.parse(storedRaw);

      // Update user data with new password and phone number
      const updatedUser = {
        ...storedUser,
        password: password,
        phoneNumber: phoneNumber,
      };

      // Save back to cookies
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });

      console.log("Changes saved successfully");
      // TODO: Add backend API call when available
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className="p-3 mb-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Profile</h2>
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
        <TextInput label="Email Address" value={email} disabled />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <AppFormButton
          text="Cancel"
          color="invert"
          isLoading={false}
          validation={true}
          action={() => {
            const storedRaw = Cookies.get("user");
            if (storedRaw) {
              const storedUser = JSON.parse(storedRaw);
              setPassword(storedUser.password || "");
              setPhoneNumber(storedUser.phoneNumber || "");
            }
          }}
        />
        <AppFormButton
          text="Save Changes"
          color="#1f2937"
          isLoading={false}
          validation={password.length > 6}
          action={handleSaveChanges}
        />
      </div>
    </div>
  );
};

export default MyProfile;
