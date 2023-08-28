import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState, useEffect } from 'react'
import { MenuContext } from '../../contexts/MenuContext'

const UpdateMenuListModal = () => {
	const {
		menuState: { menuList },
		showUpdateMenuListModal,
		setShowUpdateMenuListModal,
		updateMenuList,
		setShowToast
	} = useContext(MenuContext)

	const [updatedMenuList, setUpdatedMenuList] = useState(menuList)

	useEffect(() => setUpdatedMenuList(menuList), [menuList])

	const { title, inUse } = updatedMenuList

	const onChangeUpdatedMenuListForm = event =>
		setUpdatedMenuList({ ...updatedMenuList, [event.target.name]: event.target.value })

	const closeDialog = () => {
		setUpdatedMenuList(menuList)
		setShowUpdateMenuListModal(false)
	}

	const onSubmit = async event => {
		event.preventDefault()
		const { success, message } = await updateMenuList(updatedMenuList)
		setShowUpdateMenuListModal(false)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	return (
		<Modal show={showUpdateMenuListModal} onHide={closeDialog}>
			<Modal.Header closeButton>
				<Modal.Title>Cập nhật danh sách thực đơn</Modal.Title>
			</Modal.Header>
			<Form onSubmit={onSubmit}>
				<Modal.Body>
					<Form.Group>
						<h5>Title</h5>
						<Form.Control
							type='text'
							placeholder='Title'
							name='title'
							required
							aria-describedby='title-help'
							value={title}
							onChange={onChangeUpdatedMenuListForm}
						/>
					</Form.Group>
					<Form.Group>
						<h5>Sử dụng</h5>
						<Form.Control as='select' name='inUse' value={inUse} onChange={onChangeUpdatedMenuListForm}>
							<option value='true'>True</option>
							<option value='false'>False</option>
						</Form.Control>
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

export default UpdateMenuListModal