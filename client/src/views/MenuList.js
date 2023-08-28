import React from 'react';
import { MenuContext } from '../contexts/MenuContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MenuList = () => {
    const { getMenuList } = useContext(MenuContext);
    const location = useLocation();
    useEffect(() => getMenuList(), [])
    const data = location.state.menuList;
    const title = location.state.title;

    const [currentPage, setCurrentPage] = useState(1);
    const menusPerPage = 5;

    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = data.slice(indexOfFirstMenu, indexOfLastMenu);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="result">
                <div className="search-result-container">
                    <h1 style={{ textAlign: 'center' }} >{title}</h1>
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
                        <p>Không tìm thấy danh sách thực đơn đã lưu nào.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default MenuList;