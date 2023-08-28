import { USERS_LOADED_SUCCESS, USERS_LOADED_FAIL, FIND_USER, UPDATE_USER } from "../contexts/constants";
export const authReducer = (state, action) => {
    const { type, payload: { isAuthenticated, userLogin, users, user } } = action

    switch (type) {
        case 'SET_AUTH':
            return {
                ...state,
                authLoading: false,
                isAuthenticated,
                userLogin
            }

        case USERS_LOADED_SUCCESS:
            return {
                ...state,
                users
            }

        case USERS_LOADED_FAIL:
            return {
                ...state,
                users: [],
            }

        case FIND_USER:
            return { ...state, user }

        case UPDATE_USER:
            const newUsers = state.users.map(u =>
                u._id === user._id ? user : u
            )

            return {
                ...state,
                users: newUsers
            }

        default:
            return state;
    }
}