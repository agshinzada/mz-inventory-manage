import { createSlice } from "@reduxjs/toolkit";
import { encryptStorage } from "../utils/storage";

const initialState = {
  token: encryptStorage.getItem("token"),
};
const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      encryptStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = false;
      encryptStorage.clear();
    },
  },
});

export const { login, logout, setLoginActivityId } = auth.actions;
export default auth.reducer;
