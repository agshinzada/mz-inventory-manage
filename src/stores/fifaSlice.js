import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tournaments: [],
  teams: [],
  matches: [],
};

const fifaSlice = createSlice({
  name: "fifa",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    logout: (state) => {
      state.user = false;
    },
  },
});

export const { setTeams, logout } = fifaSlice.actions;
export default fifaSlice.reducer;
