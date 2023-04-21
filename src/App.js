import "./App.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import CustomizedTreeView from "./components/elements/tree-view";
import { EmployeeEditForm } from "./components/elements/employe-edit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createHierarchy } from "./redux/employeeSlice";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createHierarchy());
  }, []);
  return (
    <Box sx={{ flexGrow: 1, paddingTop: 2 }}>
      <Grid container spacing={2}>
        <Grid xs={5}>
          <Item>
            <CustomizedTreeView />
          </Item>
        </Grid>
        <Grid xs={7}>
          <EmployeeEditForm />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
