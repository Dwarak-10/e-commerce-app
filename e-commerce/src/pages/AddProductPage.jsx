import { Card, CardContent, Typography, TextField, Button } from '@mui/material'
import { Field, Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utlis/api'
import { useSelector } from 'react-redux'

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  price: Yup.number().required('Required').min(1),
  description: Yup.string().required('Required'),
  image: Yup.string().url('Invalid URL').required('Required'),
})



const AddProductPage = () => {
  const createProduct = async (product) => {
    try {
      // const { data } = await api.post("/products", product)
      const { data } = await api.post("/vendor/add-product", product)
      console.log("Product created:", data)
      return data
    } catch (error) {
      console.log("Error creating product:", error)
    }
  }
  const navigate = useNavigate()
  const vendor = useSelector(store => store?.user)

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      alert('Product added successfully')
      // navigate('/products')
    },
    onError: (err) => {
      alert('Failed to add product')
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
              title: '',
              price: '',
              description: '',
              image: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const productData = {
                ...values,
                vendorId: vendor?.id,
                price: parseFloat(values.price),
                rating: { rate: 0, count: 0 },
              }
              mutation.mutate(productData)
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                {/* Title */}
                <Field name="title">
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
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Image URL"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
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
    </div>

  )
}

export default AddProductPage
