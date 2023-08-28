import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import { useForm } from 'react-hook-form';
import { useContext, useState, useEffect } from 'react'
import { MenuContext } from '../../contexts/MenuContext'
import { AuthContext } from '../../contexts/AuthContext'
import makeAnimated from 'react-select/animated'
const animatedComponents = makeAnimated();

const UpdateMenuModal = () => {
	const { authState: { userLogin: {role }} } = useContext(AuthContext);
	const {
		menuState: { menu },
		showUpdateMenuModal,
		setShowUpdateMenuModal,
		updateMenu,
		setShowToast
	} = useContext(MenuContext)

	const { handleSubmit, register, setValue, reset } = useForm();

	useEffect(() => {
		reset(menu);
	}, [menu]);

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

	var menuTags = [];
	menu.tags.forEach(function (element) {
		menuTags.push({ label: element, value: element })
	})

	const closeDialog = () => {
		setShowUpdateMenuModal(false)
	}

	const onSubmit = async data => {
		var tags;
		if (data.selectedTags !== undefined) {
			tags = data.selectedTags.map((tag) => tag.value)
		} else {
			tags = menu.tags;
		}
		var items;
		if (!Array.isArray(data.items)) {
			items = data.items.replace(/\s*,\s*/g, ",").replace(/,\s*$/, "").split(',');
		} else {
			items = menu.items;
		}

		const updatedMenu = {
			_id: menu._id,
			items: items,
			selectedTags: tags,
			isPublic: data.isPublic
		};

		const { success, message } = await updateMenu(updatedMenu)
		setShowUpdateMenuModal(false)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	let setPublic = '';
	if (role === 'admin') {
		setPublic = <Form.Group>
			<h5>Public</h5>
			<Form.Control as='select' name='isPublic' {...register("isPublic")} >
				<option value='true'>True</option>
				<option value='false'>False</option>
			</Form.Control>
		</Form.Group>
	}

	return (
		<Modal show={showUpdateMenuModal} onHide={closeDialog}>
			<Modal.Header closeButton>
				<Modal.Title>Cập nhật thực đơn</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					<h4>Các món ăn</h4>
					<Form.Group>
						<Form.Control type='textarea' placeholder='Món ăn' name='items' required {...register("items")} />
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
							defaultValue={menuTags.map(tag => tag)}
							onChange={(selectedOptions) => setValue('selectedTags', selectedOptions)}
						/>
					</div>
					{setPublic}
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

export default UpdateMenuModal