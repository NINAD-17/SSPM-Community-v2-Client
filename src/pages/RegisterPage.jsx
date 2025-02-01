import React from "react";
import RegisterForm from "../features/auth/components/RegisterForm";
import Layout from "../components/layout/Layout";

const RegisterPage = () => {
    return (
        <Layout showNavbar={false}>
            <RegisterForm />
        </Layout>
    );
};

export default RegisterPage;
