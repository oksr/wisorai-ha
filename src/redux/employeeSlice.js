import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEdit: false,
  currentEmployee: null,
  employees: [],
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setCurrentEmployee: (state, action) => {
      state.currentEmployee = action.payload;
      state.isEdit = false;
    },
    setEmployeesData: (state, action) => {
      state.employees = action.payload;
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter((employee) => employee.id !== action.payload);
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },

    updateEmployeeData: (state, action) => {
      state.currentEmployee = { ...action.payload };
      state.employees = state.employees.map((employee) => {
        if (employee.id === action.payload.id) {
          return { ...action.payload };
        }
        return employee;
      });
    },
  },
});

export const { setIsEdit, setCurrentEmployee, updateEmployeeData, setEmployeesData } =
  employeeSlice.actions;

export default employeeSlice.reducer;
