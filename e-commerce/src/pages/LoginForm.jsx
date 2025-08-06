import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../utlis/api";

const validationSchema = (isLoginForm) => Yup.object({
    username: Yup.string().when([], {
        is: () => isLoginForm,
        then: (schema) => schema.required("Username is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    confirmPassword: Yup.string().when([], {
        is: () => isLoginForm,
        then: (schema) =>
            schema
                .oneOf([Yup.ref('password'), null], "Passwords must match")
                .required("Confirm Password is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
})

const createUser = async (userData) => {
    const { user } = await api.post("/users", userData)
    return user
}

export default function LoginForm() {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            alert('User created successfully')
            navigate('/feed')
        },
        onError: (error) => {
            alert('Failed to create user')
            console.error("Error in LoginForm:", error)
        }
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" >
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">{isLoginForm ? "Login" : "Signup"}</h2>

                <Formik
                    initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                    validationSchema={validationSchema(!isLoginForm)}
                    onSubmit={(values, { setSubmitting }) => {
                        if (isLoginForm) {
                            // Handle login
                            console.log("Login Data:", values);
                        } else {
                            mutation.mutate(values);
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="space-y-4">

                            {/* Username */}
                            {!isLoginForm && <div>
                                <label className="block font-medium">Username</label>
                                <Field
                                    name="username"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                            </div>}

                            {/* Email */}
                            <div>
                                <label className="block font-medium">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block font-medium">Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>
                            {!isLoginForm && <div>
                                <label className="block font-medium">Confirm Password</label>
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                            </div>}
                            <div className="">

                                {isLoginForm ? <span className="">New user?
                                    <button type="button" className="ms-2 cursor-pointer hover:text-red-800" onClick={() => { setIsLoginForm(value => !value) }}>click here</button>
                                </span> :
                                    <span className="">Already a user?
                                        <button type="button" className="ms-2 cursor-pointer hover:text-red-800" onClick={() => { setIsLoginForm(value => !value) }}>click here</button>
                                    </span>
                                }
                            </div>

                            {/* Submit */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
                                >
                                    Submit
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div >
    );
}
