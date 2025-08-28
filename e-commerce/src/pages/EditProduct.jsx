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
    const [preview, setPreview] = useState(null);
    const [dialogTitle, setDialogTitle] = useState("")


    const handleCloseDialog = () => {
        setOpenDialog(false);
        navigate("/vendor/my-products");
    }


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

        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                // Append fields except image first
                for (const key in values) {
                    if (key !== "image") {
                        formData.append(key, values[key]);
                    }
                }
                // Append image only if it is a File object (new upload)
                if (values.image && values.image instanceof File) {
                    formData.append("image", values.image);
                }

                await api.put(`/api/vendor/products/${id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setDialogTitle("Success");
                setDialogMessage("Successfully updated product.");
                setOpenDialog(true);
            } catch (err) {
                setDialogTitle("Error");
                setDialogMessage("Update failed. Please try again.");
                setOpenDialog(true);
                console.error(err);
            }
        }


    })

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/api/vendor/products/${id}/`)
            // console.log("Fetched Product:", data)
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


    const imageSrc = preview || (typeof formik.values.image === 'string' && formik.values.image !== "" ? formik.values.image : null);
    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("image", file);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);


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


                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #ccc", padding: 1, borderRadius: 1, textAlign: "center" }}>
                            <label htmlFor="image" className='cursor-pointer'>Upload Image</label>

                            <img src={imageSrc} className='w-20 h-20 object-contain' alt="Loading..." />
                            <input
                                id="image"
                                name="image"
                                style={{ display: "none" }}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Box>

                        {formik.touched.image && formik.errors.image && (
                            <div style={{ color: "red", fontSize: 12 }}>{formik.errors.image}</div>
                        )}
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
                <DialogTitle color={dialogTitle === "Error" ? 'error' : 'success'}>{dialogTitle}</DialogTitle>
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
