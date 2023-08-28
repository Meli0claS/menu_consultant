import { MenuContext } from '../contexts/MenuContext';
import { useContext, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge'
import MenuListActionButtons from '../components/menuList/MenuListActionButtons'
import UpdateMenuListModal from '../components/menuList/UpdateMenuListModal'
import moment from 'moment'

const MyMenuList = () => {
    const { menuState: { menuList, menuLists }, showToast: { show, message, type }, setShowToast, getUserMenus } = useContext(MenuContext);

    useEffect(() => getUserMenus(), [])

    let body = null;
    body = (
        <>
            <div className="text-center">
                <h1>Danh sách thực đơn tư vấn của bạn</h1>
                <h2>Số lượng {menuLists.length}</h2>
            </div>
            <Row className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3">
                {menuLists.map(menu => (
                    <Col key={menu._id} className='my-2'>
                        <Card
                            className='shadow'
                            border='success'
                            style={{ height: '15rem' }}
                        >
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Col>
                                            <p>{menu.title}</p>
                                        </Col>
                                        <Col className='text-right'>
                                            <MenuListActionButtons id={menu._id} title={menu.title}/>
                                        </Col>
                                    </Row>
                                </Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            <p className="menu-items">Đang sử dụng: <Badge
                                                pill
                                                variant={menu.inUse.toString() === 'true' ? 'success' : 'danger'}
                                            >
                                                {menu.inUse.toString()}
                                            </Badge></p>
                                            <p>Thời gian tạo: {moment(menu.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                            <p>Thời gian cập nhật: {moment(menu.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</p>
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
            {menuList !== null && <UpdateMenuListModal />}
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

export default MyMenuList