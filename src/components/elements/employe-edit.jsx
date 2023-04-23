import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { Stack, TextField, Button, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import {
  updateEmployeeData,
  setIsEdit,
  deleteEmployeeData,
  setCurrentEmployee,
} from "../../redux/employeeSlice";

import { useFormik } from "formik";
import { useLocation, useLoaderData } from "react-router-dom";
import { useEffect } from "react";

export const StyledInput = styled(TextField)(({ isEdit }) => ({
  "& .MuiInputBase-root": {
    color: "white",
    padding: "10px 12px",
    border: isEdit ? "1px solid #000" : "1px solid #fff",
  },
}));

const validationSchema = yup.object({
  email: yup.string("Enter your email").email("Enter a valid email").required("Email is required"),
});

// const useOutsideClick = (callback) => {
//   const ref = React.useRef();

//   React.useEffect(() => {
//     const handleClick = (event) => {
//       callback();
//     };

//     document.addEventListener("click", handleClick);

//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, []);

//   return ref;
// };

const StyledTextField = styled((props) => <TextField {...props} />)(({ theme }) => ({
  "& .MuiInputBase-root": {
    border: "1px solid #fff",
    width: "100%",
  },
  "& .MuiTextField-root": {
    width: "100%",
  },
}));

export const EmployeeEditableInput = ({ id, value, error, touched, handleChange }) => {
  const isEdit = useSelector((state) => state.employee.isEdit);
  const currentEmployee = useSelector((state) => state.employee.currentEmployee);
  const variants = id === "first_name" || id === "last_name" ? "h5" : "body2";
  return (
    <>
      {isEdit ? (
        <StyledTextField
          disabled={!isEdit}
          id={id}
          name={id}
          sx={{
            padding: "0px",
            border: "0px solid transparent",
            width: "100%",
          }}
          value={value}
          placeholder={id}
          onChange={handleChange}
          error={touched && Boolean(error)}
        />
      ) : (
        <Typography variant={variants} component="div" sx={{ flexGrow: 1 }}>
          {currentEmployee[id]}
        </Typography>
      )}
    </>
  );
};

export const EmployeeEditForm = () => {
  const dispatch = useDispatch();
  const currentEmployee = useSelector((state) => state.employee.currentEmployee);
  const isEdit = useSelector((state) => state.employee.isEdit);
  const location = useLocation();
  const empData = useLoaderData();

  const initialValues = {
    first_name: currentEmployee?.first_name,
    last_name: currentEmployee?.last_name,
    email: currentEmployee?.email,
    username: currentEmployee?.username,
    street_address: currentEmployee?.street_address,
    bio: currentEmployee?.bio,
    id: currentEmployee?.id,
    profile_pic: currentEmployee?.profile_pic,
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
  });
  function handleSubmit() {
    dispatch(updateEmployeeData({ ...currentEmployee, ...formik.values }));
  }

  useEffect(() => {
    console.log("rendered");
    dispatch(setCurrentEmployee(empData));
  }, [location.pathname]);

  if (!currentEmployee)
    return (
      <Stack
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ fontSize: "1.2rem" }}
      >
        Please choose employee...
      </Stack>
    );
  return (
    <Stack
      maxWidth={"400px"}
      margin={"0 auto"}
      boxShadow={"0px 11px 11px -5px rgba(0,0,0,0.24)"}
      p={4}
    >
      <form onSubmit={formik.handleSubmit} enableReinitialize={true}>
        <Stack spacing={2} direction={"row"} alignItems={"center"} minHeight={"200px"}>
          <Stack direction={"column"} gap={1}>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Avatar
                sx={{ width: 100, height: 100 }}
                alt={currentEmployee?.first_name}
                src={currentEmployee?.profile_pic}
              />
              {isEdit ? (
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                  {currentEmployee?.first_name + " " + currentEmployee?.last_name}
                </Typography>
              ) : null}
            </Stack>
            <>
              <Stack direction={"row"} gap={1} width={"fit-content"}>
                {["first_name", "last_name"].map((field) => (
                  <EmployeeEditableInput
                    key={field}
                    id={field}
                    name={field}
                    value={formik.values[field]}
                    error={formik.errors[field]}
                    touched={formik.touched[field]}
                    handleChange={formik.handleChange}
                  />
                ))}
              </Stack>

              {["email", "username", "street_address", "bio"].map((field) => (
                <EmployeeEditableInput
                  key={field}
                  id={field}
                  name={field}
                  value={formik.values[field]}
                  error={formik.errors[field]}
                  touched={formik.touched[field]}
                  handleChange={formik.handleChange}
                  sx={{ width: "100%" }}
                />
              ))}
            </>
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          spacing={2}
          marginTop={2}
          width={"100%"}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              dispatch(deleteEmployeeData(currentEmployee?.id));
            }}
          >
            <AiOutlineDelete />
          </Button>
          {isEdit ? (
            <>
              <Button
                variant="underline"
                onClick={() => {
                  dispatch(setIsEdit(!isEdit));
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                dispatch(setIsEdit(!isEdit));
              }}
            >
              Edit
            </Button>
          )}
        </Stack>
      </form>
    </Stack>
  );
};
