import { AuthContext } from '../contexts/AuthContext';
import { MenuContext } from '../contexts/MenuContext';
import { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge'
import UserActionButtons from '../components/user/UserActionButtons'
import UpdateUserModal from '../components/user/UpdateUserModal'
import moment from 'moment'

const UserList = () => {
    const { authState: { users, user },  showToast: { show, message, type }, getUserList, setShowToast } = useContext(AuthContext);

    useEffect(() => getUserList(), [])

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 9;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currenUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    let body = null;
    body = (
        <>
            <div className="text-center">
                <h1>Danh sách người dùng trong hệ thống</h1>
                <h2>Số lượng {users.length}</h2>
            </div>
            {users.length > usersPerPage && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-button"
                    >
                        Trang trước
                    </button>
                    <button
                        disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-button"
                    >
                        Trang sau
                    </button>
                </div>
            )}
            <Row className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3">
                {currenUsers.map(user => (
                    <Col key={user._id} className='my-2'>
                        <Card
                            className='shadow'
                            border={'success'}
                            style={{ height: '18rem' }}
                        >
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Col>
                                            <p>Role: <Badge
                                                pill
                                                variant={user.role === 'admin' ? 'warning' : 'success'}
                                            >
                                                {user.role}
                                            </Badge></p>
                                        </Col>
                                        <Col className='text-right'>
                                            <UserActionButtons id={user._id} username={user.username} />
                                        </Col>
                                    </Row>
                                </Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            <p className="menu-items">Username: {user.username}</p>
                                            <p className="menu-items">Họ và tên: {user.fullname}</p>
                                            <p className="menu-items">Email: {user.email}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <p>Thời gian tạo: {moment(user.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                            <p>Thời gian cập nhật: {moment(user.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )

    return (
        <>
            {body}
            {user !== null && <UpdateUserModal />}
            <Toast
                show={show}
                style={{ position: 'fixed', top: '20%', right: '10px' }}
                className={`bg-${type} text-white`}
                onClose={setShowToast.bind(this, {
                    show: false,
                    message: '',
                    type: null
                })}
                delay={3000}
                autohide
            >
                <Toast.Body>
                    <strong>{message}</strong>
                </Toast.Body>
            </Toast>
        </>
    )
}

export default UserList