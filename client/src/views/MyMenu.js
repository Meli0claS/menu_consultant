import { MenuContext } from '../contexts/MenuContext';
import { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast';
import Badge from 'react-bootstrap/Badge'
import MenuActionButtons from '../components/menu/MenuActionButtons'
import UpdateMenuModal from '../components/menu/UpdateMenuModal'
import AddMenuModal from '../components/menu/AddMenuModal'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import addIcon from '../assets/plus.gif'
import ReactStars from "react-rating-stars-component";
import moment from 'moment'

const MyMenu = () => {
    const { menuState: { menu, menus }, showToast: { show, message, type }, setShowToast, setShowAddMenuModal, getMyMenus } = useContext(MenuContext);

    useEffect(() => getMyMenus(), [])

    const [currentPage, setCurrentPage] = useState(1);
    const menusPerPage = 9;
    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    let body = null;
    body = (
        <>
            <div className="text-center">
                <h1>Danh sách các thực đơn của bạn</h1>
                <h2>Số lượng {menus.length}</h2>
            </div>
            {menus.length > menusPerPage && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-button"
                    >
                        Trang trước
                    </button>
                    <button
                        disabled={currentPage === Math.ceil(menus.length / menusPerPage)}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-button"
                    >
                        Trang sau
                    </button>
                </div>
            )}
            <Row className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3">
                {currentMenus.map(menu => (
                    <Col key={menu._id} className='my-2'>
                        <Card
                            className='shadow'
                            border={
                                menu.isPublic.toString() === 'true'
                                    ? 'success'
                                    : 'danger'
                            }
                            style={{ height: '22rem' }}
                        >
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Col>
                                            <p>Public: <Badge
                                                pill
                                                variant={menu.isPublic.toString() === 'true' ? 'success' : 'danger'}
                                            >
                                                {menu.isPublic.toString()}
                                            </Badge></p>
                                        </Col>
                                        <Col>
                                            <ReactStars
                                                name="rating"
                                                count={5}
                                                size={24}
                                                value={menu.rating}
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                        </Col>
                                        <p>({menu.ratedCount})</p>
                                        <Col className='text-right'>
                                            <MenuActionButtons id={menu._id} />
                                        </Col>
                                    </Row>
                                </Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            <p className="menu-items">Món ăn: {menu.items.join(', ')}</p>
                                            <p className="menu-tags">Nhãn dán: {menu.tags.join(', ')}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
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
            <OverlayTrigger
                placement='left'
                overlay={<Tooltip>Thêm thực đơn mới</Tooltip>}
            >
                <Button
                    className='btn-floating'
                    onClick={setShowAddMenuModal.bind(this, true)}
                >
                    <img src={addIcon} alt='add-post' width='60' height='60' />
                </Button>
            </OverlayTrigger>
        </>
    )

    return (
        <>
            {body}
            <AddMenuModal />
            {menu !== null && <UpdateMenuModal />}
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

export default MyMenu