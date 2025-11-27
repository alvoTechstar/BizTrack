import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const name = "auth";
const initialState = createInitialState();

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setAuth(state, action) {
      state.value = action.payload;
      // Only set cookie, not localStorage to reduce storage ops
      Cookies.set("user", JSON.stringify(action.payload), { expires: 7 });
    },
    logout(state) {
      state.value = null;
      Cookies.remove("user");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = { ...slice.actions };
export const authReducer = slice.reducer;

function createInitialState() {
  try {
    // Try to get from cookies first (faster than localStorage)
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      return { value: user };
    }
  } catch (error) {
    console.error("Error reading auth from storage:", error);
    Cookies.remove("user");
  }
  
  return { value: null };
}