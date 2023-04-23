import "./App.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import CustomizedTreeView from "./components/elements/tree-view";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createHierarchy } from "./redux/employeeSlice";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createHierarchy());
  }, []);
  return (
    <Box sx={{ flexGrow: 1, paddingTop: 2 }}>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <CustomizedTreeView />
        </Grid>
        <Grid xs={8}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
