import { createContext, useReducer, useState } from "react";
import { menuReducer } from "../reducers/MenuReducer";
import {
    apiURL,
    MENUS_LOADED_SUCCESS,
    MENUS_LOADED_FAIL,
    MENULISTS_LOADED_SUCCESS,
    MENULISTS_LOADED_FAIL,
    ADD_MENU,
    UPDATE_MENU,
    FIND_MENU,
    DELETE_MENULIST,
    FIND_MENULIST,
    UPDATE_MENULIST,
    FIND_USER_MENU
} from "./constants";
import axios from "axios";

export const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
    const [menuState, dispatch] = useReducer(menuReducer, {
        menu: null,
        menus: [],
        menuList: null,
        menuLists: [],
        menuLoading: true
    })

    const [showAddMenuModal, setShowAddMenuModal] = useState(false)
    const [showUpdateMenuModal, setShowUpdateMenuModal] = useState(false)
    const [showUpdateMenuListModal, setShowUpdateMenuListModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    const getAllMenus = async () => {
        try {
            const response = await axios.get(`${apiURL}/menus/get_all_menus`);
            if (response.data.success) {
                dispatch({ type: MENUS_LOADED_SUCCESS, payload: response.data.menus });
            }
        } catch (error) {
            dispatch({ type: MENUS_LOADED_FAIL })
        }
    }

    const getInPublicMenus = async () => {
        try {
            const response = await axios.get(`${apiURL}/menus/get_inpublic_menus`);
            if (response.data.success) {
                dispatch({ type: MENUS_LOADED_SUCCESS, payload: response.data.menus });
            }
        } catch (error) {
            dispatch({ type: MENUS_LOADED_FAIL })
        }
    }

    const getMyMenus = async () => {
        try {
            const response = await axios.get(`${apiURL}/menus/get_my_menus`);
            if (response.data.success) {
                dispatch({ type: MENUS_LOADED_SUCCESS, payload: response.data.menus });
            }
        } catch (error) {
            dispatch({ type: MENUS_LOADED_FAIL })
        }
    }

    const searchMenu = async searchForm => {
        try {
            const response = await axios.post(`${apiURL}/menus/search`, searchForm);
            if (response.data.success)
                return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const addUserMenu = async menuList => {
        try {
            const response = await axios.post(`${apiURL}/usermenus/add`, menuList);
            if (response.data.success)
                return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const getUserMenus = async () => {
        try {
            const response = await axios.get(`${apiURL}/usermenus/get_my_menus`);
            if (response.data.success) {
                dispatch({ type: MENULISTS_LOADED_SUCCESS, payload: response.data.menuLists });
            }
        } catch (error) {
            dispatch({ type: MENULISTS_LOADED_FAIL })
        }
    }

    const findMenu = menuId => {
        const menu = menuState.menus.find(menu => menu._id === menuId);
        dispatch({ type: FIND_MENU, payload: menu })
    }

    const addMenu = async menu => {
        try {
            const response = await axios.post(`${apiURL}/menus/add`, menu);
            if (response.data.success) {
                dispatch({ type: ADD_MENU, payload: response.data.menu })
                return response.data
            }
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const updateMenu = async updatedMenu => {
        try {
            const response = await axios.put(
                `${apiURL}/menus/${updatedMenu._id}`,
                updatedMenu
            )
            if (response.data.success) {
                dispatch({ type: UPDATE_MENU, payload: response.data.menu })
                return response.data
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const getMenuList = async menuListId => {
        try {
            const response = await axios.get(`${apiURL}/usermenus/${menuListId}`)
            if (response.data.success) {
                return response.data.menuList;
            }
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const findMenuList = menuListId => {
        const menuList = menuState.menuLists.find(menuList => menuList._id === menuListId);
        dispatch({ type: FIND_MENULIST, payload: menuList })
    }

    const updateMenuList = async updatedMenuList => {
        try {
            const response = await axios.put(
                `${apiURL}/usermenus/${updatedMenuList._id}`,
                updatedMenuList
            )
            if (response.data.success) {
                dispatch({ type: UPDATE_MENULIST, payload: response.data.menuList })
                return response.data
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' }
        }
    }

    const deleteMenuList = async menuListId => {
        try {
            const response = await axios.delete(`${apiURL}/usermenus/${menuListId}`)
            if (response.data.success)
                dispatch({ type: DELETE_MENULIST, payload: menuListId })
        } catch (error) {
            console.log(error)
        }
    }

    const findMenuByUser = async userId => {
        try {
            const response = await axios.get(`${apiURL}/menus/user/${userId}`)
            if (response.data.success)
                dispatch({ type: FIND_USER_MENU, payload: response.data.menus })
        } catch (error) {
            console.log(error)
        }
    }

    const ratingMenu = async ratingInfo => {
        try {
            const response = await axios.post(`${apiURL}/menus/rating_menu`, ratingInfo)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const menuContextData = {
        menuState,
        getAllMenus,
        getInPublicMenus,
        getMyMenus,
        showAddMenuModal,
        setShowAddMenuModal,
        showUpdateMenuModal,
        setShowUpdateMenuModal,
        showUpdateMenuListModal,
        setShowUpdateMenuListModal,
        searchMenu,
        addMenu,
        findMenu,
        updateMenu,
        addUserMenu,
        getUserMenus,
        findMenuList,
        deleteMenuList,
        updateMenuList,
        getMenuList,
        showToast,
        setShowToast,
        findMenuByUser,
        ratingMenu
    };

    return (
        <MenuContext.Provider value={menuContextData}>
            {children}
        </MenuContext.Provider>
    )
}

export default MenuContextProvider