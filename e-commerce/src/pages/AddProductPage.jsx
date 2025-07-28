// pages/AddProductPage.jsx
import React from 'react'
import { Card, CardContent, Typography, TextField, Button } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { createProduct } from '../utlis/api'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  price: Yup.number().required('Required').min(1),
  description: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  image: Yup.string().url('Invalid URL').required('Required'),
})

const AddProductPage = () => {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      alert('Product added successfully')
      navigate('/products') // or wherever you want
    },
    onError: () => {
      alert('Failed to add product')
    },
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      price: '',
      description: '',
      category: '',
      image: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const productData = {
        ...values,
        vendorId: 'v1', 
        price: parseFloat(values.price),
        rating: { rate: 0, count: 0 },
      }
      mutation.mutate(productData)
    },
  })

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="max-w-xl w-full shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">Add New Product</Typography>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              fullWidth
              id="price"
              name="price"
              label="Price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            <TextField
              fullWidth
              id="category"
              name="category"
              label="Category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            />

            <TextField
              fullWidth
              id="image"
              name="image"
              label="Image URL"
              value={formik.values.image}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProductPage
