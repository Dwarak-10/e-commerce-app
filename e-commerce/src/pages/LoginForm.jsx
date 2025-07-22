import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"

const validationSchema = (formName) => Yup.object({
    username: Yup.string().when([], {
        is: () => formName === "signup",
        then: (schema) => schema.required("Username is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    role: Yup.string().when([], {
        is: () => formName === "signup",
        then: (schema) =>
            schema
                .oneOf(["admin", "vendor"], "Role is required")
                .required("Role is required"),
        otherwise: (schema) => schema.notRequired(),
    })
})

export default function LoginForm() {
    const [selectedRole, setSelectedRole] = useState("");
    const [formName, setFormName] = useState("signup");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" >
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">{formName === "login" ? "Login" : "Signup"}</h2>

                <Formik
                    initialValues={{ username: "", email: "", password: "", role: "" }}
                    validationSchema={validationSchema(formName)}
                    onSubmit={(values) => {
                        console.log("Form Data:", values);
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="space-y-4">

                            {/* Username */}
                            {formName !== "login" && <div>
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

                            {/* Role Selection Buttons */}
                            {formName !== "login" && <div>
                                <label className="block font-medium mb-1">Select Role</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedRole("admin");
                                            setFieldValue("role", "admin");
                                        }}
                                        className={`flex-1 p-2 border rounded-md cursor-pointer ${selectedRole === "admin"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        Admin
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedRole("vendor");
                                            setFieldValue("role", "vendor");
                                        }}
                                        className={`flex-1 p-2 border rounded-md cursor-pointer ${selectedRole === "vendor"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        Vendor
                                    </button>
                                </div>
                                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                            </div>}

                            <div className="">

                                {formName === "login" ? <span className="">New user?
                                    <button type="button" className="ms-2 cursor-pointer hover:text-red-800" onClick={() => { setFormName("signup") }}>click here</button>
                                </span> :
                                    <span className="">Already a user?
                                        <button type="button" className="ms-2 cursor-pointer hover:text-red-800" onClick={() => { setFormName("login") }}>click here</button>
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
