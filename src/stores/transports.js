import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  transports: [],
  types: [],
  brands: [],
  models: [],
  parts: [],
  payments: [],
  filteredModels: [],
  filteredPayments: [],
  transportCodes: [],
  modelCodes: [],
};

export const getTranports = createAsyncThunk("fetchTransports", async () => {
  try {
    const response = await axios.get(`${urlRoot}/transports`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});
export const getTranportTypes = createAsyncThunk(
  "fetchTransportTypes",
  async () => {
    try {
      const response = await axios.get(`${urlRoot}/transports/types`);
      return response.data;
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  }
);
export const getTranportBrands = createAsyncThunk(
  "fetchTransportBrands",
  async () => {
    try {
      const response = await axios.get(`${urlRoot}/transports/brands`);
      return response.data;
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  }
);
export const getTranportModels = createAsyncThunk(
  "fetchTransportModels",
  async () => {
    try {
      const response = await axios.get(`${urlRoot}/transports/models`);
      return response.data;
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  }
);
export const getTranportParts = createAsyncThunk(
  "fetchTransportParts",
  async () => {
    try {
      const response = await axios.get(`${urlRoot}/transports/parts`);
      return response.data;
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  }
);
export const getTranportPayments = createAsyncThunk(
  "fetchTransportPayments",
  async () => {
    try {
      const response = await axios.get(`${urlRoot}/transports/payments`);
      return response.data;
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  }
);

const transports = createSlice({
  name: "transports",
  initialState,
  reducers: {
    setFilteredModels: (state, action) => {
      state.filteredModels = action.payload;
    },
    setFilteredPayments: (state, action) => {
      state.filteredPayments = action.payload;
    },
    setTransportCodes: (state, action) => {
      state.transportCodes = action.payload;
    },
    setModelCodes: (state, action) => {
      state.modelCodes = action.payload;
    },
    setSearchedTransport: (state, action) => {
      state.transports = action.payload;
    },
    setSearchedTransportPayment: (state, action) => {
      state.payments = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getTranports.fulfilled, (state, action) => {
      state.transports = action.payload;
      state.loading = false;
    });
    builder.addCase(getTranports.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTranports.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getTranportTypes.fulfilled, (state, action) => {
      state.types = action.payload;
      state.loading = false;
    });
    builder.addCase(getTranportTypes.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTranportTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getTranportBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
      state.loading = false;
    });
    builder.addCase(getTranportBrands.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTranportBrands.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getTranportModels.fulfilled, (state, action) => {
      state.models = action.payload;
      state.loading = false;
    });
    builder.addCase(getTranportModels.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTranportModels.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getTranportParts.fulfilled, (state, action) => {
      state.parts = action.payload;
      state.loading = false;
    });
    builder.addCase(getTranportParts.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTranportParts.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getTranportPayments.fulfilled, (state, action) => {
      state.payments = action.payload;
      state.loading = false;
    });
    builder.addCase(getTranportPayments.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTranportPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

export const {
  setTransportBrands,
  setFilteredModels,
  setTransportCodes,
  setModelCodes,
  setFilteredPayments,
  setSearchedTransport,
  setSearchedTransportPayment,
} = transports.actions;
export default transports.reducer;
