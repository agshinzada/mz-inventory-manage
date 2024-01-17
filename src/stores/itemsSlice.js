import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";

const initialState = {
  items: [],
  table: [],
  office: [],
  warehouse: [],
  serviceItems: [],
  damageItems: [],
  itemCodes: [],
  itemOldCodes: [],
  loading: false,
  error: null,
};

export const getItems = createAsyncThunk("fetchItems", async () => {
  try {
    const response = await axios.get(`${urlRoot}/items`);
    return response.data;
  } catch (error) {
    notifyError(`${error.name}: ${error.message}`);
  }
});

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    filterItems: (state, action) => {
      state.items = action.payload;
    },
    setSearchedItems: (state, action) => {
      state.items = action.payload;
    },
    setItemCodes: (state, action) => {
      state.itemCodes = action.payload;
    },
    setItemOldCodes: (state, action) => {
      state.itemOldCodes = action.payload;
    },
    setServiceItems: (state, action) => {
      state.serviceItems = action.payload;
    },
    setDamageItems: (state, action) => {
      state.damageItems = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getItems.fulfilled, (state, action) => {
      state.items = action.payload;
      state.table = action.payload;
      state.office = action.payload.filter((item) => item.LOCATION_ID === 1);
      state.warehouse = action.payload.filter((item) => item.LOCATION_ID === 2);
      state.loading = false;
    });
    builder.addCase(getItems.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getItems.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error fetching items data";
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  filterItems,
  setItemCodes,
  setItemOldCodes,
  setSearchedItems,
  setServiceItems,
  setDamageItems,
} = itemsSlice.actions;

export default itemsSlice.reducer;
