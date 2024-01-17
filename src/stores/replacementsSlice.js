import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  replacements: [],
  office: [],
  warehouse: [],
  loading: false,
  error: null,
};

export const getReplacements = createAsyncThunk(
  "fetchReplacements",
  async () => {
    try {
      const response = await axios.get(`${urlRoot}/items/replacements`);
      return response.data;
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  }
);

export const replacementsSlice = createSlice({
  name: "replacements",
  initialState,
  reducers: {
    filterItems: (state, action) => {
      state.replacements = action.payload;
    },
    setSearchedReplacements: (state, action) => {
      state.replacements = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getReplacements.fulfilled, (state, action) => {
      state.replacements = action.payload;
      state.office = action.payload.filter((repl) => repl.LOCATION_ID === 1);
      state.warehouse = action.payload.filter((repl) => repl.LOCATION_ID === 2);
      state.loading = false;
    });
    builder.addCase(getReplacements.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getReplacements.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const { filterItems, setSearchedReplacements } =
  replacementsSlice.actions;

export default replacementsSlice.reducer;
