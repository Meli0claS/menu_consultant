import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../../assets/logo.png';
import logoutIcon from '../../assets/logout.png';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';

const NavbarMenu = () => {
    const { authState: { userLogin: { username, role } }, logoutUser } = useContext(AuthContext);
    const logout = () => logoutUser
    let userList;
    if (role === 'admin') {
        userList = <Nav.Link className='font-weight-border text-white' to='/user_list' as={Link}>
            Danh sách người dùng
        </Nav.Link>
    }
    return (
        <Navbar expand='lg' bg='primary' variant='dark' className='shadow'>
            <Navbar.Brand className='font-weight-border text-white'>
                <a href="/home">
                    <img src={logo} alt='logo' width='55' height='40' className='mr-2' />
                </a>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto'>
                    <Nav.Link className='font-weight-border text-white' to='/my_menu_list' as={Link}>
                        Danh sách thực đơn tư vấn đã lưu
                    </Nav.Link>
                    <Nav.Link className='font-weight-border text-white' to='/my_menu' as={Link}>
                        Thực đơn của tôi
                    </Nav.Link>
                    <Nav.Link className='font-weight-border text-white' to='/all_menu' as={Link}>
                        Tất cả thực đơn
                    </Nav.Link>
                    <Nav.Link className='font-weight-border text-white' to='/rating_menu' as={Link}>
                        Thực đơn chờ đánh giá
                    </Nav.Link>
                    {userList}
                </Nav>

                <Nav>
                    <Nav.Link className='font-weight-border text-white' disabled>
                        Xin chào {username}
                    </Nav.Link>
                    <Button variant='secondary' className='font-weight-border text-white' onClick={logout()} >
                        <img src={logoutIcon} alt='logout' width='32' height='32' className='mr-2' /> Đăng xuất
                    </Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavbarMenu