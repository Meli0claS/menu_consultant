import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const UpdateUserModal = () => {
	const {
		authState: { user },
		showUpdateUserModal,
		setShowUpdateUserModal,
		updateUser,
		setShowToast
	} = useContext(AuthContext)

	const [updatedUser, setUpdatedUser] = useState(user)

	useEffect(() => setUpdatedUser(user), [user])

	const { username, email, fullname } = updatedUser

	const onChangeUpdatedUserForm = event =>
		setUpdatedUser({ ...updatedUser, [event.target.name]: event.target.value })

	const closeDialog = () => {
		setUpdatedUser(user)
		setShowUpdateUserModal(false)
	}

	const onSubmit = async event => {
		event.preventDefault()
		const { success, message } = await updateUser(updatedUser)
		setShowUpdateUserModal(false)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	return (
		<Modal show={showUpdateUserModal} onHide={closeDialog}>
			<Modal.Header closeButton>
				<Modal.Title>Cập nhật người dùng</Modal.Title>
			</Modal.Header>
			<Form onSubmit={onSubmit}>
				<Modal.Body>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Username'
							name='username'
							required
							value={username}
							onChange={onChangeUpdatedUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Họ và tên'
							name='fullname'
							value={fullname}
							onChange={onChangeUpdatedUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='email'
							placeholder='Email'
							name='email'
							value={email}
							onChange={onChangeUpdatedUserForm}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeDialog}>
						Hủy
					</Button>
					<Button variant='primary' type='submit'>
						Xác nhận
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

export default UpdateUserModal