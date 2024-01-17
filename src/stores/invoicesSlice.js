import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  invoices: [],
  nonPriceInvoices: [],
  itemCodes: [],
  docCodes: [],
  newItemInvoices: [],
  loading: false,
  error: null,
};

export const getInvoices = createAsyncThunk("fetchInvoices", async () => {
  try {
    const response = await axios.get(`${urlRoot}/items/invoices`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    filterInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setSearchedInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setNonPriceInvoices: (state, action) => {
      state.nonPriceInvoices = action.payload;
    },
    setItemCodes: (state, action) => {
      state.itemCodes = action.payload;
    },
    setDocCodes: (state, action) => {
      state.docCodes = action.payload;
    },
    setNewItemInvoices: (state, action) => {
      state.newItemInvoices = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload;
      state.loading = false;
    });
    builder.addCase(getInvoices.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getInvoices.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  filterInvoices,
  setItemCodes,
  setSearchedInvoices,
  setDocCodes,
  setNewItemInvoices,
  setNonPriceInvoices,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
