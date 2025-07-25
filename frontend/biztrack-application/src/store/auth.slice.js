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
      Cookies.set("user", JSON.stringify(action.payload), { expires: 1 });
    },
    logout(state) {
      state.value = null;
      Cookies.remove("user");
    },
  },
});

export const authActions = { ...slice.actions };
export const authReducer = slice.reducer;

function createInitialState() {
  const user = Cookies.get("user");
  try {
    return {
      value: user ? JSON.parse(user) : null,
    };
  } catch {
    Cookies.remove("user"); // clean up bad cookie
    return { value: null };
  }
}
