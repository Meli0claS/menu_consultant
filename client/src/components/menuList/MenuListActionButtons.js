import Button from 'react-bootstrap/Button'
import openIcon from '../../assets/open.png'
import editIcon from '../../assets/pencil.png'
import deleteIcon from '../../assets/trash.png'
import { useHistory } from 'react-router-dom';
import { MenuContext } from '../../contexts/MenuContext'
import { useContext } from 'react'

const MenuListActionButtons = ({ id, title }) => {
	const { findMenuList, deleteMenuList, getMenuList, setShowUpdateMenuListModal } = useContext(MenuContext)

	const history = useHistory();

	const chooseMenuList = menuListId => {
		findMenuList(menuListId)
		setShowUpdateMenuListModal(true);
	}

	const openMenuList = async menuListId => {
		findMenuList(menuListId)
		var menuList = await getMenuList(menuListId)
		const menuListInfo = {
			menuList: menuList,
			title: title
		}
		history.push({pathname:'/menu_list', state: menuListInfo});
	}

	return (
		<>
			<Button className='post-button' onClick={openMenuList.bind(this, id)}>
				<img src={openIcon} alt='play' width='32' height='32' />
			</Button>
			<Button className='post-button' onClick={chooseMenuList.bind(this, id)}>
				<img src={editIcon} alt='edit' width='24' height='24' />
			</Button>
			<Button className='post-button' onClick={deleteMenuList.bind(this, id)}>
				<img src={deleteIcon} alt='delete' width='24' height='24' />
			</Button>
		</>
	)
}

export default MenuListActionButtons