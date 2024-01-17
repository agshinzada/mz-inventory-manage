import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  departments: [],
  regions: [],
  newDepartmentName: "",
  departmentName: "",
  departmentId: "",
  loading: false,
  error: null,
};

export const getDepartments = createAsyncThunk("fetchDepartments", async () => {
  try {
    const response = await axios.get(`${urlRoot}/departments`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const getRegions = createAsyncThunk("fetchRegions", async () => {
  try {
    const response = await axios.get(`${urlRoot}/regions`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setNewDepartmentName: (state, action) => {
      state.newDepartmentName = action.payload;
    },
    setDepartmentName: (state, action) => {
      state.departmentName = action.payload;
    },
    setDepartmentId: (state, action) => {
      state.departmentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getDepartments.fulfilled, (state, action) => {
      state.departments = action.payload;
      state.loading = false;
    });
    builder.addCase(getDepartments.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getRegions.fulfilled, (state, action) => {
      state.regions = action.payload;
      state.loading = false;
    });
    builder.addCase(getRegions.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRegions.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const { setNewDepartmentName, setDepartmentName, setDepartmentId } =
  departmentsSlice.actions;

export default departmentsSlice.reducer;
