import Button from 'react-bootstrap/Button'
import editIcon from '../../assets/pencil.png'
import openIcon from '../../assets/open.png'
import { AuthContext } from '../../contexts/AuthContext'
import { MenuContext } from '../../contexts/MenuContext'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom';

const UserActionButtons = ({ id, username }) => {
	const { findUser, setShowUpdateUserModal } = useContext(AuthContext)

	const history = useHistory();

	const chooseUser = userId => {
		findUser(userId)
		setShowUpdateUserModal(true);
	}

	const openUserMenu = async userId => {
		const userInfo = {
			userId: userId,
			username: username
		}
		history.push({pathname:'/user_menu', state: userInfo});
	}

	return (
		<>
			<Button className='post-button' onClick={chooseUser.bind(this, id)}>
				<img src={editIcon} alt='edit' width='24' height='24' />
			</Button>
			<Button className='post-button' onClick={openUserMenu.bind(this, id)}>
				<img src={openIcon} alt='edit' width='24' height='24' />
			</Button>
		</>
	)
}

export default UserActionButtons