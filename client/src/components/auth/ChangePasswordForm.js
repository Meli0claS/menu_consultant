import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const ChangePasswordForm = () => {
    const { changePassword } = useContext(AuthContext);

    const history = useHistory();

    const [ChangePasswordForm, setChangePasswordForm] = useState({
        otp: '',
        password: '',
        confirmPassword: '',
    })

    const [alert, setAlert] = useState(null);

    const { otp, password, confirmPassword } = ChangePasswordForm;

    const onChangeChangePasswordForm = event => setChangePasswordForm({ ...ChangePasswordForm, [event.target.name]: event.target.value });

    const verify = async event => {
        event.preventDefault();
        try {
            const change_password = await changePassword(ChangePasswordForm);
            if (!change_password.success) {
                setAlert({ type: 'danger', message: change_password.message });
                setTimeout(() => setAlert(null));
            } else {
                if (password.length < 8) {
                    setAlert({ type: 'danger', message: 'Mật khẩu phải từ 8 ký tự trở lên' });
                    setTimeout(() => setAlert(null), 5000);
                    return;
                } else if (password !== confirmPassword) {
                    setAlert({ type: 'danger', message: 'Mật khẩu không khớp' });
                    setTimeout(() => setAlert(null), 5000);
                    return;
                } else {
                    history.push('/login');
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Form className='my-4' onSubmit={verify}>
                <div class="alert alert-success">
                    Mã OTP đã được gửi đến địa chỉ email của bạn! <br/> (Hiệu lực 5 phút)
                </div>
                <AlertMessage info={alert} />
                <Form.Group>
                    <Form.Control type='text' placeholder='Mã OTP' name='otp' required value={otp} onChange={onChangeChangePasswordForm} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type='password' placeholder='Mật khẩu' name='password' required value={password} onChange={onChangeChangePasswordForm} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type='password' placeholder='Xác nhận mật khẩu' name='confirmPassword' value={confirmPassword} required onChange={onChangeChangePasswordForm} />
                </Form.Group>
                <Button variant='success' type='submit'>Xác nhận</Button>
            </Form>
        </>
    )
}

export default ChangePasswordForm