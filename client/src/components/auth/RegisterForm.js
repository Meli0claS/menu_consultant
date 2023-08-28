import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const RegisterForm = () => {
  const { registerUser } = useContext(AuthContext);

  const [registerForm, setRegisterForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const [alert, setAlert] = useState(null);

  const { fullname, email, username, password, confirmPassword } = registerForm;

  const onChangeRegisterForm = event => setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });

  const register = async event => {
    event.preventDefault();

    if (password.length < 8) {
      setAlert({ type: 'danger', message: 'Mật khẩu phải từ 8 ký tự trở lên' });
      setTimeout(() => setAlert(null), 5000);
      return;
    } else if (password !== confirmPassword) {
      setAlert({ type: 'danger', message: 'Mật khẩu không khớp' });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    try {
      const registerData = await registerUser(registerForm);
      if (!registerData.success) {
        setAlert({ type: 'danger', message: registerData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Form className='my-4' onSubmit={register}>
        <AlertMessage info={alert} />
        <Form.Group>
          <Form.Control type='text' placeholder='Họ và tên' name='fullname' required value={fullname} onChange={onChangeRegisterForm} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='email' placeholder='Email' name='email' required value={email} onChange={onChangeRegisterForm} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='text' placeholder='Tên đăng nhập' name='username' required value={username} onChange={onChangeRegisterForm} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='password' placeholder='Mật khẩu' name='password' required value={password} onChange={onChangeRegisterForm} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='password' placeholder='Xác nhận mật khẩu' name='confirmPassword' required value={confirmPassword} onChange={onChangeRegisterForm} />
        </Form.Group>
        <Button variant='success' type='submit'>Đăng ký</Button>
      </Form>
      <p>Bạn đã có tài khoản?
        <Link to='/login'>
          <Button variant='info' size='sm' className='ml-2'>Đăng nhập</Button>
        </Link>
      </p>
    </>
  )
}

export default RegisterForm