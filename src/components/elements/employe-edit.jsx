import { useSelector, useDispatch } from "react-redux";
import { Stack, TextField, Button, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { updateEmployeeData, setIsEdit, deleteEmployeeData } from "../../redux/employeeSlice";

import { useFormik } from "formik";

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

export const EmployeeEditForm = () => {
  const dispatch = useDispatch();
  const currentEmployee = useSelector((state) => state.employee.currentEmployee);
  const isEdit = useSelector((state) => state.employee.isEdit);

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
  if (!currentEmployee) return <div>Please choose employee from left pane...</div>;
  return (
    <Stack>
      <form onSubmit={formik.handleSubmit} enableReinitialize={true}>
        <Stack spacing={2} direction={"row"} alignItems={"center"} pr={5} minHeight={"200px"}>
          {!isEdit ? (
            <>
              <Avatar
                sx={{ width: 100, height: 100 }}
                alt={currentEmployee?.first_name}
                src={currentEmployee?.profile_pic}
              />

              <Stack direction={"column"}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {currentEmployee?.first_name} {currentEmployee?.last_name}
                </Typography>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                  {currentEmployee?.email}
                </Typography>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                  {currentEmployee?.username}
                </Typography>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                  {currentEmployee?.street_address}
                </Typography>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                  {currentEmployee?.bio}
                </Typography>
              </Stack>
            </>
          ) : (
            <Stack spacing={2} direction={"column"}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Edit: {currentEmployee?.first_name} {currentEmployee?.last_name}
              </Typography>
              <TextField
                disabled={!isEdit}
                fullWidth
                id="first_name"
                name="first_name"
                label="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />

              <TextField
                disabled={!isEdit}
                fullWidth
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
              <TextField
                disabled={!isEdit}
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                disabled={!isEdit}
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                disabled={!isEdit}
                fullWidth
                id="street_address"
                name="street_address"
                label="Street Address"
                value={formik.values.street_address}
                onChange={formik.handleChange}
                error={formik.touched.street_address && Boolean(formik.errors.street_address)}
                helperText={formik.touched.street_address && formik.errors.street_address}
              />
              <TextField
                disabled={!isEdit}
                fullWidth
                id="bio"
                name="bio"
                label="Bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={formik.touched.bio && formik.errors.bio}
              />
            </Stack>
          )}
        </Stack>

        <Stack direction={"row"} spacing={2} marginTop={2} width={"100%"}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              dispatch(deleteEmployeeData(currentEmployee?.id));
            }}
          >
            Delete
          </Button>
          {isEdit ? (
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
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
