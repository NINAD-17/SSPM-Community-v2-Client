import React from "react";
import LoginForm from "../features/auth/components/LoginForm";
import Layout from "../components/layout/Layout";

const LoginPage = () => {
    return (
        <Layout showNavbar={false}>
            <LoginForm />
        </Layout>
    );
};

export default LoginPage;
