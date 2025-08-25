import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import api from '../utlis/api'

const EditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")

    const handleCloseDialog = () => setOpenDialog(false)


    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: '',
            image: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            price: Yup.number().required('Price is required').positive('Must be positive'),
            image: Yup.string().url('Must be a valid URL')
        }),
        onSubmit: async (values) => {
            try {
                await api.put(`/api/vendor/products/${id}/`, values)
                navigate('/vendor/my-products')
            } catch (err) {
                setDialogMessage("Update failed. Please try again.")
                setOpenDialog(true)
                console.error(err)
            }
        }
    })

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/api/vendor/products/${id}/`)
            console.log("Fetched Product:", data)
            formik.setValues({
                name: data.name,
                description: data.description,
                price: data.price,
                image: data.image
            })
        } catch (error) {
            setDialogMessage("Product not found")
            setOpenDialog(true)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [])

    return (
        <Box className="flex justify-center items-center min-h-screen bg-gray-100">
            <Paper elevation={4} sx={{ p: 4, width: 400 }}>
                <div className='flex flex-col items-center mb-4'>
                    <Typography variant="h5" gutterBottom>Edit Product</Typography>
                </div>
                {formik.isSubmitting ? (
                    <Box className="flex justify-center py-4">
                        <CircularProgress />
                    </Box>
                ) : (
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
                        <TextField
                            fullWidth
                            label="Title"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={3}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />

                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />

                        <TextField
                            fullWidth
                            label="Image URL"
                            name="image"
                            // type='file'
                            value={formik.values.image}
                            onChange={formik.handleChange}
                            error={formik.touched.image && Boolean(formik.errors.image)}
                            helperText={formik.touched.image && formik.errors.image}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Save Changes
                        </Button>
                    </form>
                )}
            </Paper>
            {/* Error Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle color='error'>Error</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditProduct
