import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  types: [],
  typeName: "",
  typeId: "",
  loading: false,
  error: null,
};

export const getTypes = createAsyncThunk("fetchTypes", async () => {
  try {
    const response = await axios.get(`${urlRoot}/items/types`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const typesSlice = createSlice({
  name: "types",
  initialState,
  reducers: {
    setEditTypeName: (state, action) => {
      state.typeName = action.payload;
    },
    setEditTypeId: (state, action) => {
      state.typeId = action.payload;
    },
    setNewTypeName: (state, action) => {
      state.newTypeName = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getTypes.fulfilled, (state, action) => {
      state.types = action.payload;
      state.loading = false;
    });
    builder.addCase(getTypes.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const { setEditTypeId, setEditTypeName, setNewTypeName } =
  typesSlice.actions;

export default typesSlice.reducer;
