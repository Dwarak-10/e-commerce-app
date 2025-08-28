import { Card, CardContent, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Field, Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utlis/api'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  price: Yup.number().required('Required').min(1),
  description: Yup.string().required('Required'),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      if (typeof value === "string") {
        // Accept strings that look like URLs (basic check)
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(value);
      }
      // For File objects, validate MIME type
      return value.type?.startsWith("image/");
    })
    .test("fileSize", "File size is too large", (value) => {
      // Only validate size if it's a File object
      if (value && typeof value !== "string") {
        return value.size <= 2 * 1024 * 1024; // 2MB
      }
      return true; // skip size check for strings
    }),
})



const AddProductPage = () => {

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")
  const [preview, setPreview] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("")


  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/vendor/my-products");
  }

  const createProduct = async (productFormData) => {
    try {
      const { data } = await api.post("/api/vendor/product/add/", productFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log("Product created:", data);
      return data;
    } catch (error) {
      setDialogTitle("Error");
      setDialogMessage("Failed to create product. Please try again.");
      setOpenDialog(true);
      console.log("Error creating product:", error);
      throw error;
    }
  };


  const navigate = useNavigate()
  const vendor = useSelector(store => store?.user)

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      setDialogTitle("Success");
      setDialogMessage("Product added successfully");
      setOpenDialog(true);
    },
    onError: (err) => {
      setDialogMessage("Failed to add product");
      setDialogTitle("Error");
      setOpenDialog(true);
      console.error("Error in AddProductPage:", err)
    },
  })



  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="max-w-xl w-full" sx={{ boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" className="mb-6" sx={{ fontWeight: 600, color: '#1f2937' }}>
            Add New Product
          </Typography>

          <Formik
            initialValues={{
              name: '',
              price: '',
              description: '',
              image: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const formData = new FormData();

              // Append all regular fields
              formData.append("name", values.name);
              formData.append("price", parseFloat(values.price).toString());
              formData.append("description", values.description);

              // Append image file only if present and is a File object
              if (values.image && values.image instanceof File) {
                formData.append("image", values.image);
              }

              mutation.mutate(formData);

              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                {/* Title */}
                <Field name="name">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {/* Price */}
                <Field name="price">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Price"
                      type="number"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {/* Description */}
                <Field name="description">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>


                {/* Image */}
                <Field name="image">
                  {({ form, meta }) => {
                    const file = form.values.image;
                    const [preview, setPreview] = React.useState(null);

                    // Generate and clean up object URL
                    React.useEffect(() => {
                      if (file instanceof File) {
                        const objectUrl = URL.createObjectURL(file);
                        setPreview(objectUrl);

                        return () => URL.revokeObjectURL(objectUrl); // cleanup
                      } else {
                        setPreview(null);
                      }
                    }, [file]);

                    return (
                      <div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            padding: 1,
                            borderRadius: 1,
                            textAlign: "center"
                          }}
                          className={meta.touched && meta.error ? "border border-red-500" : ""}
                        >
                          <label htmlFor="image" className="cursor-pointer">
                            Upload Image
                          </label>

                          {preview && (
                            <img
                              src={preview}
                              alt="Preview"
                              style={{ width: 80, height: 80, objectFit: "cover", marginLeft: 10 }}
                            />
                          )}

                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              form.setFieldValue("image", file);
                            }}
                            style={{ display: "none", marginTop: 8 }}
                          />
                        </Box>

                        {meta.touched && meta.error && (
                          <div
                            style={{
                              color: "red",
                              fontSize: 12,
                              marginLeft: 14,
                              marginTop: 2
                            }}
                          >
                            {meta.error}
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Field>



                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ paddingY: 1.3, textTransform: 'none', fontWeight: 600 }}
                  disabled={isSubmitting || mutation.isPending}
                >
                  {mutation.isPending ? 'Adding...' : 'Add Product'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle color={dialogTitle === "Error" ? 'error' : 'success'}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>

  )
}

export default AddProductPage
