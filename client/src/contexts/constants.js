export const apiURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:5000/api' : 'https://menu-consultant.onrender.com/api'
export const LOCAL_STORAGE_TOKEN_NAME = 'menu-mern'
export const MENUS_LOADED_SUCCESS = 'MENUS_LOADED_SUCCESS'
export const MENUS_LOADED_FAIL = 'MENUS_LOADED_FAIL'
export const USERS_LOADED_SUCCESS = 'USERS_LOADED_SUCCESS'
export const USERS_LOADED_FAIL = 'USERS_LOADED_FAIL'
export const MENULISTS_LOADED_SUCCESS = 'MENULISTS_LOADED_SUCCESS'
export const MENULISTS_LOADED_FAIL = 'MENULISTS_LOADED_FAIL'
export const TAGS_LOADED_SUCCESS = 'TAGS_LOADED_SUCCESS'
export const TAGS_LOADED_FAIL = 'TAGS_LOADED_FAIL'
export const ADD_MENU = 'ADD_MENU'
export const UPDATE_MENU = 'UPDATE_MENU'
export const FIND_MENU = 'FIND_MENU'
export const DELETE_MENULIST = 'DELETE_MENULIST'
export const FIND_MENULIST = 'FIND_MENULIST'
export const UPDATE_MENULIST = 'UPDATE_MENULIST'
export const FIND_USER = 'FIND_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const FIND_USER_MENU = 'FIND_USER_MENU'
