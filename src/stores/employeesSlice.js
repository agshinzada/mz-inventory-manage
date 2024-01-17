import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  employees: [],
  numbers: [],
  loading: false,
  error: null,
};

export const getEmployees = createAsyncThunk("fetchEmployees", async () => {
  try {
    const response = await axios.get(`${urlRoot}/employees`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSearchedEmployee: (state, action) => {
      state.employees = action.payload;
    },
    setEmployeeNumber: (state, action) => {
      state.numbers = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getEmployees.fulfilled, (state, action) => {
      state.employees = action.payload;
      state.loading = false;
    });
    builder.addCase(getEmployees.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSearchedEmployee, setEmployeeNumber } =
  employeesSlice.actions;

export default employeesSlice.reducer;
