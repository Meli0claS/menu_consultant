import { MenuContext } from '../contexts/MenuContext';
import { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ReactStars from "react-rating-stars-component";
import moment from 'moment'

const AllMenu = () => {
    const { menuState: { menus }, showToast: { show, message, type }, getAllMenus, ratingMenu, setShowToast } = useContext(MenuContext);
    useEffect(() => getAllMenus(), [])

    const [currentPage, setCurrentPage] = useState(1);
    const menusPerPage = 9;
    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    var rateScore = '';
    const ratingChanged = (newRating) => {
        rateScore = newRating
    };

    const rating = async event => {
        event.preventDefault();
        const ratingInfo = {
			menuId: event.target.menuId.value,
			rating: rateScore
		};

        const { success, message } = await ratingMenu(ratingInfo)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
        window.location.reload(true)
    }

    let body = null;
    body = (
        <>
            <div className="text-center">
                <h1>Danh sách thực đơn</h1>
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
                    <Form onSubmit={rating}>
                        <Form.Control type='hidden' name='menuId' value={menu._id}/>
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
                                                <ReactStars
                                                    name="rating"
                                                    count={5}
                                                    size={24}
                                                    onChange={ratingChanged}
                                                    value={menu.rating}
                                                    activeColor="#ffd700"
                                                />
                                            </Col>
                                            <Col>
                                                <span>{menu.ratedCount} đánh giá</span>
                                            </Col>
                                            <Col>
                                                <Button className='btn btn-info' type='submit'>Đánh giá</Button>
                                            </Col>
                                        </Row>
                                    </Card.Title>
                                    <Card.Text>
                                        <Row>
                                            <Col>
                                                <p className="menu-tags">Người tạo: {menu.user.username}</p>
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
                    </Form>
                ))}
            </Row>
        </>
    )

    return (
        <>
            {body}
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

export default AllMenu