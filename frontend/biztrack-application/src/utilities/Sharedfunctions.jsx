import * as yup from 'yup';
import JSEncrypt from "jsencrypt";
import { returnStatusResponse } from "../services/LocalStorageService";

// Accepted Card Patterns
export const ACCEPTED_CARDS = [
  { name: "visa", pattern: /^4[0-9]{12}(?:[0-9]{3})?$/ },
  { name: "mastercard", pattern: /^5[1-5][0-9]{14}$/ },
  { name: "verve", pattern: /^50[0-9]{14}$/ },
  { name: "unionpay", pattern: /^62[0-9]{14,17}$/ },
];

// Card Number Validation
export const cardNumberValidation = yup
  .string()
  .transform((value) => value.replace(/[^\d]/g, ""))
  .required("Please enter your card number")
  .matches(
    /^[0-9]{16}$|^[0-9]{19}$/,
    "The card number must be 16 or 19 digits long"
  )
  .test("valid-card-type", "Invalid card number", (value) => {
    return ACCEPTED_CARDS.some((card) => card.pattern.test(value));
  });

// Expiry Date Validation
export const expiryValidation = yup
  .string()
  .required("Enter the card's expiry")
  .length(5, "Should be exactly 5 characters long")
  .test("format", "Invalid date format", (value) =>
    /^(0\d|1[0-2])\/\d{2}$/.test(value)
  )
  .test("not-expired", "Card has expired", (value) => {
    if (!value) return false;
    const [month, year] = value.split("/");
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(parseInt("20" + year), parseInt(month) - 1, 1);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  });

// CVV Validation
export const cvvValidation = yup
  .string()
  .required("Please enter the card's CVV")
  .matches(/^\d{3}$/, "The CVV must be exactly 3 digits");

// Email Validation
export const validateEmail = (email) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
    String(email).toLowerCase()
  );
};
export const getEncryptValue = (password) => {
  let e = new JSEncrypt();
  e.setPublicKey(returnStatusResponse().value);
  return e.encrypt(password.replace(/\s/g, ""));
};
//phone number validation
export const validatePhoneNumber = (phone) => {
  return /^(254|0)([7]\d|[1][0-1]){1}\d{1}\d{6}$/.test(phone);
};
// Password Validation
export const validatePassword = (test, password) => {
  switch (test) {
    case "length":
      return password.length >= 7;
    case "characters":
      return /[^A-z\s\d][\\^]?/.test(password);
    case "uppercase":
      return /([A-Z])/.test(password);
    case "number":
      return /\d+/.test(password);
    default:
      return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
        password
      );
  }
};

// utilities/Sharedfunctions.js
export function normalizeRole(role) {
  switch (role) {
    case "biztrack-admin":
      return "Super Admin";
    case "hotel-admin":
      return "Hotel Admin";
    case "hotel-cashier":
      return "Cashier";
    case "hotel-waiter":
      return "Waiter";
    case "kiosk-admin":
      return "Kiosk Admin";
    case "kiosk-shopkeeper":
      return "Shopkeeper";
    default:
      return role;
  }
}

