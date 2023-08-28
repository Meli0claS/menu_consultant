import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { useContext } from 'react'
import { MenuContext } from '../../contexts/MenuContext'
import { AuthContext } from '../../contexts/AuthContext';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const AddMenuModal = () => {
	const { authState: { userLogin: { role } } } = useContext(AuthContext);
	const {
		showAddMenuModal,
		setShowAddMenuModal,
		addMenu,
		setShowToast
	} = useContext(MenuContext)

	const { handleSubmit, register, setValue } = useForm();

	const timeOptions = [
		{ value: "buổi sáng", label: "buổi sáng"},
		{ value: "buổi trưa", label: "buổi trưa"},
		{ value: "buổi tối", label: "buổi tối"},
	];

	const typeOptions = [
		{ value: "tiết kiệm", label: "tiết kiệm" },
		{ value: "bình thường", label: "bình thường"},
		{ value: "cao cấp", label: "cao cấp" }
	];

	const regionOptions = [
		{ value: "châu á", label: "châu á" },
		{ value: "châu âu", label: "châu âu"},
	];

	const nutriOptions = [
		{ value: "giàu đạm", label: "giàu đạm" },
		{ value: "giàu canxi", label: "giàu canxi"},
		{ value: "giàu chất xơ", label: "giàu chất xơ" },
		{ value: "giàu mỡ", label: "giàu mỡ" }
	]

	const sideOptions = [
		{ value: "miền bắc", label: "miền bắc" },
		{ value: "tăng nam", label: "miền nam"},
		{ value: "miền trung", label: "miền trung" },
	]

	const otherOptions = [
		{ value: "chay", label: "chay" },
		{ value: "tăng cân", label: "tăng cân"},
		{ value: "giảm cân", label: "giảm cân" },
		{ value: "đặc sản", label: "đặc sản" },
	]

	const groupedOptions = [
		{
			label: "Buổi",
			options: timeOptions
		},
		{
			label: "Chi phí",
			options: typeOptions
		}
		,{
			label: "Khu vực",
			options: regionOptions
		},
		{
			label: "Miền (Việt Nam)",
			options: sideOptions
		},{
			label: "Dinh dưỡng",
			options: nutriOptions
		},
		{
			label: "Khác",
			options: otherOptions
		}
	];

	const closeDialog = () => {
		resetAddMenuData()
	}

	const onSubmit = async data => {
		var isPublic = false
		if (role === 'admin') {
			isPublic = true
		}
		const newMenu = {
			items: data.items.trim().split(','),
			selectedTags: data.selectedTags.map((tag) => tag.value),
			isPublic: isPublic
		};
		const { success, message } = await addMenu(newMenu)
		resetAddMenuData()
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	const resetAddMenuData = () => {
		setShowAddMenuModal(false)
	}

	return (
		<Modal show={showAddMenuModal} onHide={closeDialog}>
			<Modal.Header closeButton>
				<Modal.Title>Thêm thực đơn mới</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					<h4>Nhập các món ăn</h4>
					<Form.Group>
						<Form.Control as='textarea' rows={3} placeholder='Món ăn' name='items' required {...register("items")} />
					</Form.Group>
					<p>Các món cách nhau bằng dấu ","</p>
					<h4>Chọn nhãn dán</h4>
					<div className="my-4">
						<Select
							name='selectedTags'
							options={groupedOptions}
							components={animatedComponents}
							noOptionsMessage={() => 'Không tìm thấy kết quả nào'}
							isMulti
							isSearchable
							required
							onChange={(selectedOptions) => setValue('selectedTags', selectedOptions)}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeDialog}>
						Hủy
					</Button>
					<Button variant='primary' type='submit'>
						Tạo
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

export default AddMenuModal