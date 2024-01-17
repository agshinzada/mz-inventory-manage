import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "../stores/itemsSlice";
import typesReducer from "../stores/typesSlice";
import departmentsReducer from "../stores/departmentsSlice";
import replacementsReducer from "../stores/replacementsSlice";
import invoicesReducer from "../stores/invoicesSlice";
import employeesReducer from "../stores/employeesSlice";
import paymentsReducer from "../stores/paymentsSlice";
import authReducer from "../stores/authSlice";
import fifaReducer from "../stores/fifaSlice";
import transportReducer from "../stores/transports";

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    types: typesReducer,
    departments: departmentsReducer,
    invoices: invoicesReducer,
    replacements: replacementsReducer,
    employees: employeesReducer,
    payments: paymentsReducer,
    auth: authReducer,
    fifa: fifaReducer,
    transports: transportReducer,
  },
});
