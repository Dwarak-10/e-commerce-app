import React, { useState } from 'react'
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import api from '../utlis/api'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    company: Yup.string().required('Company name is required'),
})

const createVendor = async (vendorData) => {
    // const { data } = await api.post('/vendors', vendorData)
    const { data } = await api.post('/api/admin/add/vendor/', vendorData)
    return data
}

const AddVendor = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        navigate("/admin/vendor-list");
    };

    const mutation = useMutation({
        mutationFn: createVendor,
        onSuccess: () => {
            setOpen(true);
        },
        onError: () => {
            alert('Failed to add vendor')
        },
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            company: '',
        },
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values)
        },
    })

    return (
        <div className="flex justify-center mt-10 px-4">
            <Card className="max-w-xl w-full" sx={{ boxShadow: 6, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Add New Vendor
                    </Typography>

                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 mt-6">
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            variant="outlined"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />

                        <TextField
                            fullWidth
                            label="Company"
                            name="company"
                            variant="outlined"
                            value={formik.values.company}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.company && Boolean(formik.errors.company)}
                            helperText={formik.touched.company && formik.errors.company}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={mutation.isPending}
                            sx={{ py: 1.3, fontWeight: 600, textTransform: 'none' }}
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Vendor'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    Vendor added successfully
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddVendor
