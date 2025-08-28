import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../utlis/api";
import { useDispatch } from "react-redux";
import { addUser } from "../utlis/userSlice";
import { isPending } from "@reduxjs/toolkit";
import { Button } from "@mui/material";

const validationSchema = (isSignup) =>
    Yup.object({
        username: Yup.string().required("Username is required"),
        email: isSignup ? Yup.string().email("Invalid email").required("Email is required") : Yup.string(),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
        confirmPassword: isSignup
            ? Yup.string()
                .oneOf([Yup.ref('password'), null], "Passwords must match")
                .required("Confirm Password is required")
            : Yup.string(),
    });

const createUser = async (userData) => {
    const newUser = {
        ...userData,
    }
    const { data } = await api.post("/api/register/", newUser)
    // console.log("SigningUser data:", data)
    return data
}

const loginUser = async (loginData) => {
    const { data } = await api.post("/api/login/", loginData);
    // console.log("loginUser data:", data);
    return data;
};

export default function LoginForm() {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const signupMutation = useMutation({
        mutationFn: createUser,
        onMutate: ({ setErrors }) => ({ setErrors }),
        onSuccess: (user, variables, context) => {
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(addUser(user));

            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/home');
            }
        },
        onError: (error) => {
            const message = error || "Something went wrong";
            console.log(message);
        }
    });
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onMutate: ({ setErrors }) => ({ setErrors }),
        onSuccess: (data, variables, context) => {
            if (!data || Object.keys(data).length === 0) {
                if (context?.setErrors) {
                    context.setErrors({ password: "Invalid email or password" });
                }
                return;
            }

            const user = data;
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(addUser(user));
            // console.log("LoggedIn user:", user)
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/home');
            }
        },
        onError: (error, variables, context) => {
            let message = "Something went wrong";
            if (error.response?.status === 400) {
                message = error?.response?.data?.Errors || "Invalid email or password";
            }

            if (context?.setErrors) {
                context.setErrors({ password: message });
            }
        },
    });
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" >
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">{isLoginForm ? "Login" : "Signup"}</h2>

                <Formik
                    initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                    validationSchema={isLoginForm ? validationSchema(false) : validationSchema(true)}
                    onSubmit={(values, { setSubmitting, setErrors }) => {
                        setSubmitting(true);
                        if (isLoginForm) {
                            const loginData = {
                                username: values.username,
                                // email: values.email,
                                password: values.password
                            };
                            loginMutation.mutate({ ...loginData, setErrors }, {
                                onSettled: () => setSubmitting(false)
                            }, isPending);
                        } else {
                            signupMutation.mutate(values, { onSettled: () => setSubmitting(false) });
                        }
                    }}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">

                            {/* Username */}
                            <label className="block font-medium">Username</label>
                            <Field
                                name="username"
                                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />

                            {/* Email */}
                            {!isLoginForm && <div>
                                <label className="block font-medium">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>}

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
                                    disabled={isSubmitting || loginMutation.isLoading || signupMutation.isLoading}
                                    className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div >
        </div >
    );
}
