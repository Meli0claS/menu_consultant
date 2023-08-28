import React from 'react';
import { MenuContext } from '../contexts/MenuContext';
import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

const Menu = () => {
    const { addUserMenu } = useContext(MenuContext);
    const { handleSubmit, register } = useForm();
    const history = useHistory();

    const location = useLocation();
    const data = location.state;
    const [currentPage, setCurrentPage] = useState(1);
    const menusPerPage = 5;

    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = data.slice(indexOfFirstMenu, indexOfLastMenu);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const save = async form => {
        var menuList = [];
        data.map((menu) =>(
            menu.map((item) =>(
                menuList.push(item))
            )
        ));
        const listForm = {
            title: form.title,
            menus: menuList,
        };
        try {
            const listMenuData = await addUserMenu(listForm);
            if (listMenuData.success) {
                history.push({ pathname: '/my_menu_list', state: listMenuData });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="result">
                <div className="search-result-container">
                    <h1 style={{ textAlign: 'center' }} >Danh sách thực đơn theo yêu cầu của bạn!</h1>
                    <div className="text-center">
                        <Form className="my-4" onSubmit={handleSubmit(save)}>
                            <Form.Group>
                                <Form.Control type='text' placeholder='Đặt tên cho thực đơn bạn muốn lưu' name='title' required {...register("title")}/>
                            </Form.Group>
                            <button type="submit" className="btn btn-primary">Lưu giữ thực đơn</button>
                        </Form>
                    </div>
                    {data.length > menusPerPage && (
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="pagination-button"
                            >
                                Trang trước
                            </button>
                            <button
                                disabled={currentPage === Math.ceil(data.length / menusPerPage)}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="pagination-button"
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                    {data.length > 0 ? (
                        <>
                            {currentMenus.map((dayMenus, index) => (
                                <div key={index} className="menu-day-container">
                                    <h2>Ngày {index + 1 + indexOfFirstMenu}</h2>
                                    <div className="menu-list">
                                        {dayMenus.map((menu, menuIndex) => (
                                            <div key={menuIndex} className="menu-item-container">
                                                <h3>Menu {menuIndex + 1}</h3>
                                                <p className="menu-items">
                                                    {menu.items.map((item, itemIndex) => (
                                                        <p key={itemIndex}>{item}</p>
                                                    ))}
                                                </p>
                                                <p className="menu-tags">Nhãn dán: {menu.tags.join(', ')}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>Không tìm thấy thực đơn nào</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Menu;