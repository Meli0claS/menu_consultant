import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import VerifyEmailForm from '../components/auth/VerifyEmailForm';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const Auth = ({ authRoute }) => {
    const { authState: {authLoading, isAuthenticated}} = useContext(AuthContext);

    let body;

    if (authLoading)
    body = (
        <div className="d-flex justify-content-center mt-2">
            <Spinner animation='border' variant='info' />
        </div>
    )
    else if (isAuthenticated) return <Redirect to='/home' />
    else
    body = (
        <>
            {authRoute === 'login' && <LoginForm />}
            {authRoute === 'register' && <RegisterForm />}
            {authRoute === 'verifyEmail' && <VerifyEmailForm />}
            {authRoute === 'changePassword' && <ChangePasswordForm />}
        </>
    )

    return (
        <div className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1>Hệ thống tư vấn thực đơn</h1>
                    <h4>Mang lại trải nghiệm tốt nhất cho người dùng</h4>
                    {body}
                </div>
            </div>
        </div>
    )
}

export default Auth