import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const VerifyEmailForm = () => {
    const { verifyEmail } = useContext(AuthContext);

    const history = useHistory();

    const [verifyEmailForm, setVerifyEmailForm] = useState({
        email: '',
      })

    const [alert, setAlert] = useState(null);

    const { email } = verifyEmailForm;

    const onChangeVerifyEmailForm = event => setVerifyEmailForm({ ...verifyEmailForm, [event.target.name]: event.target.value });

    const verify = async event => {
        event.preventDefault();

        try {
            const checkEmail = await verifyEmail(verifyEmailForm);
            if (!checkEmail.success) {
                setAlert({ type: 'danger', message: checkEmail.message });
                setTimeout(() => setAlert(null), 5000);
            } else {
                history.push('/change_password');
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Form className='my-4' onSubmit={verify}>
                <AlertMessage info={alert} />
                <Form.Group>
                    <Form.Control type='email' placeholder='Email' name='email' required value={email} onChange={onChangeVerifyEmailForm}/>
                </Form.Group>
                <Button variant='success' type='submit'>Xác nhận</Button>
            </Form>
        </>
    )
}

export default VerifyEmailForm