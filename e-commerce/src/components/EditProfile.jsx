import { useState } from "react";
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Snackbar, TextField, Typography } from "@mui/material";


const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phoneNum: Yup.number().typeError('Phone Number must be a number').positive('Phone Number must be positive'),
  age: Yup.number().typeError('Age must be a number').positive('Age must be positive'),
  gender: Yup.string(),
  about: Yup.string(),
})

const EditProfile = ({ user }) => {
  const [showToast, setShowToast] = useState(false)

  const initialValues = {
    firstName: '',
    lastName: '',
    phoneNum: '',
    age: '',
    gender: '',
    about: '',
  }

  const handleSubmit = (values) => {
    console.log('Saved profile:', values)
    setShowToast(true)
  }

  return (
    <>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 5,
        mb: { xs: 24, md: 32 },
        px: 2,
      }}
    >
      <Card sx={{ width: 400, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Edit Profile
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, values }) => (
              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    fullWidth
                  />

                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    fullWidth
                  />

                  <TextField
                    label="Phone Number"
                    name="phoneNum"
                    value={values.phoneNum}
                    onChange={handleChange}
                    error={touched.phoneNum && Boolean(errors.phoneNum)}
                    helperText={touched.phoneNum && errors.phoneNum}
                    fullWidth
                  />

                  <TextField
                    label="Age"
                    name="age"
                    value={values.age}
                    onChange={handleChange}
                    error={touched.age && Boolean(errors.age)}
                    helperText={touched.age && errors.age}
                    fullWidth
                  />

                  <TextField
                    label="Gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    fullWidth
                  />

                  <TextField
                    label="About"
                    name="about"
                    value={values.about}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    fullWidth
                  />

                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                      Save Profile
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
          Profile saved successfully.
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
};



export default EditProfile;