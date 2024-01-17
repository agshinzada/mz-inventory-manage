import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  payments: [],
  openPayments: [],
  fiches: [],
  ficheCodes: [],
  unconfirmedFiches: [],
  amount: [],
  lastFicheCode: null,
  previousMonthAmount: [],
  monthlyFiches: [],
  groupByFicheNo: [],
  ficheLength: [],
  loading: false,
  error: null,
};

export const getFicheCodes = createAsyncThunk("fetchFicheCodes", async () => {
  try {
    const response = await axios.get(`${urlRoot}/items/payments/fichecode`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const getPayments = createAsyncThunk("fetchPayments", async () => {
  try {
    const response = await axios.get(`${urlRoot}/items/payments`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const getFiches = createAsyncThunk("fetchFiches", async () => {
  try {
    const response = await axios.get(`${urlRoot}/items/payments/fiches`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setSearchedFiches: (state, action) => {
      state.fiches = action.payload;
    },
    setUnconfirmedFiches: (state, action) => {
      state.unconfirmedFiches = action.payload;
    },
    setSearchedPayments: (state, action) => {
      state.payments = action.payload;
    },
    setPaymentByFicheNo: (state, action) => {
      state.groupByFicheNo = action.payload;
    },
    setMonthlyPayments: (state, action) => {
      state.monthly = action.payload;
    },
    setMonthlyFiches: (state, action) => {
      state.monthlyFiches = action.payload;
    },
    setCurrentAmount: (state, action) => {
      state.amount = action.payload;
    },
    setPreviousMonthAmount: (state, action) => {
      state.previousMonthAmount = action.payload;
    },
    setficheLength: (state, action) => {
      state.ficheLength = action.payload;
    },
    setLastFicheCode: (state, action) => {
      state.lastFicheCode = action.payload;
    },
    setOpenPayments: (state, action) => {
      state.openPayments = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getFicheCodes.fulfilled, (state, action) => {
      state.ficheCodes = action.payload;
      state.loading = false;
    });
    builder.addCase(getFicheCodes.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getFicheCodes.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getPayments.fulfilled, (state, action) => {
      state.payments = action.payload;
      state.loading = false;
    });
    builder.addCase(getPayments.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
    builder.addCase(getFiches.fulfilled, (state, action) => {
      state.fiches = action.payload;
      state.loading = false;
    });
    builder.addCase(getFiches.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getFiches.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setSearchedFiches,
  setSearchedPayments,
  setCurrentAmount,
  setficheLength,
  setMonthlyPayments,
  setPaymentByFicheNo,
  setMonthlyFiches,
  setPreviousMonthAmount,
  setLastFicheCode,
  setOpenPayments,
  setUnconfirmedFiches,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
