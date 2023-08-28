import Button from 'react-bootstrap/Button'
import editIcon from '../../assets/pencil.png'
import { MenuContext } from '../../contexts/MenuContext'
import { useContext } from 'react'

const MenuActionButtons = ({ id }) => {
	const { findMenu, setShowUpdateMenuModal } = useContext(MenuContext)

	const chooseMenu = menuId => {
		findMenu(menuId)
		setShowUpdateMenuModal(true);
	}

	return (
		<>
			<Button className='post-button' onClick={chooseMenu.bind(this, id)}>
				<img src={editIcon} alt='edit' width='24' height='24' />
			</Button>
		</>
	)
}

export default MenuActionButtons