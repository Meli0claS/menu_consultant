import {
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
} from "../contexts/constants";

export const menuReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case MENUS_LOADED_SUCCESS:
            return {
                ...state,
                menus: payload,
                menuLoading: false
            }

        case MENUS_LOADED_FAIL:
            return {
                ...state,
                menus: [],
                menuLoading: false
            }

        case MENULISTS_LOADED_SUCCESS:
            return {
                ...state,
                menuLists: payload,
                menuLoading: false
            }

        case MENULISTS_LOADED_FAIL:
            return {
                ...state,
                menuLists: [],
                menuLoading: false
            }

        case FIND_MENULIST:
            return { ...state, menuList: payload }

        case DELETE_MENULIST:
            return {
                ...state,
                menuLists: state.menuLists.filter(menuList => menuList._id !== payload)
            }

        case UPDATE_MENULIST:
            const newMenuLists = state.menuLists.map(menuList =>
                menuList._id === payload._id ? payload : menuList
            )

            return {
                ...state,
                menuLists: newMenuLists
            }

        case FIND_MENU:
            return { ...state, menu: payload }

        case ADD_MENU:
            return {
                ...state,
                menus: [...state.menus, payload]
            }

        case UPDATE_MENU:
            const newMenus = state.menus.map(menu =>
                menu._id === payload._id ? payload : menu
            )

            return {
                ...state,
                menus: newMenus
            }

        case FIND_USER_MENU:
            return { ...state, menus: payload }

        default:
            return state
    }
}