import { configureStore } from "@reduxjs/toolkit";
import employeSlice from "./employeeSlice.js";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    employee: employeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
