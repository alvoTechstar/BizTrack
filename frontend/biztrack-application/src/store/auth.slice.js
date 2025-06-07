// store/auth.slice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const name = "auth";
const initialState = createInitialState();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers });

// exports
export const authActions = { ...slice.actions };
export const authReducer = slice.reducer;

// implementation
function createInitialState() {
  // Get the cookie and parse it to an object
  const user = Cookies.get("user");
  return {
    value: user ? JSON.parse(user) : null,  // Ensure the cookie is parsed as an object
  };
}

function createReducers() {
  return {
    setAuth,
    logout, // Add the logout function
  };

  function setAuth(state, action) {
    state.value = action.payload;
    // Save the user data in the cookie as a stringified object
    Cookies.set("user", JSON.stringify(action.payload), { expires: 1 });
  }

  function logout(state) {
    state.value = null;  // Clear the user data in the Redux store
    Cookies.remove("user");  // Remove the user cookie
  }
}
