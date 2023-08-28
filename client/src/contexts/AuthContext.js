import { createContext, useReducer, useEffect, useState } from 'react';
import { authReducer } from '../reducers/AuthReducer';
import { apiURL, LOCAL_STORAGE_TOKEN_NAME, USERS_LOADED_SUCCESS, USERS_LOADED_FAIL, FIND_USER, UPDATE_USER } from './constants';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        userLogin: null,
        user: null,
        users: []
    });

    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false)
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    const loadUser = async () => {
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
        }

        try {
            const response = await axios.get(`${apiURL}/auth`)
            if (response.data.success) {
                dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: true, userLogin: response.data.user } });
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
            setAuthToken(null);
            dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, userLogin: null } });
        }
    }

    useEffect(() => loadUser(), []);

    const loginUser = async userForm => {
        try {
            const response = await axios.post(`${apiURL}/auth/login`, userForm);
            if (response.data.success)
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);

            await loadUser();

            return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const registerUser = async userForm => {
        try {
            const response = await axios.post(`${apiURL}/auth/register`, userForm);
            if (response.data.success)
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);

            await loadUser();

            return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, userLogin: null } });
    }

    const verifyEmail = async userForm => {
        try {
            const response = await axios.post(`${apiURL}/auth/verify_email`, userForm);
            if (response.data.success)
                return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const changePassword = async userForm => {
        try {
            const response = await axios.post(`${apiURL}/auth/change_password`, userForm);
            if (response.data.success)
                return response.data;
        } catch (error) {
            if (error.response.data) return error.response.data;
            else return { success: false, message: error.message };
        }
    }

    const getUserList = async () => {
        try {
            const response = await axios.get(`${apiURL}/users/all_users`);
            if (response.data.success) {
                dispatch({ type: USERS_LOADED_SUCCESS, payload: { isAuthenticated: true, users: response.data.users } });
            }
        } catch (error) {
            dispatch({ type: USERS_LOADED_FAIL })
        }
    }

    const findUser = userId => {
        const user = authState.users.find(user => user._id === userId);
        dispatch({ type: FIND_USER, payload: {user: user} })
    }

    const updateUser = async updatedUser => {
		try {
			const response = await axios.put(
				`${apiURL}/users/${updatedUser._id}`,
				updatedUser
			)
			if (response.data.success) {
				dispatch({ type: UPDATE_USER, payload: {user: response.data.user} })
				return response.data
			}
		} catch (error) {
			return error.response.data
				? error.response.data
				: { success: false, message: 'Server error' }
		}
	}

    const authContextData = {
        loginUser,
        registerUser,
        logoutUser,
        verifyEmail,
        changePassword,
        getUserList,
        findUser,
        updateUser,
        setShowUpdateUserModal,
        showUpdateUserModal,
        showToast,
        setShowToast,
        authState
    }

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider