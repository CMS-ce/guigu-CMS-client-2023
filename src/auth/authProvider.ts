// in src/authProvider.ts

import authApi from '@/api/authApi'
import { AuthProvider } from 'react-admin'

// TypeScript users must reference the type: `AuthProvider`
export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    login: async ({ username, password }) => {
        const res = await authApi.reqLogin(username, password)
        localStorage.setItem('jwt_token', res.data.data.access_token)
        localStorage.setItem('username', username)
        // accept all username/password combinations
        return Promise.resolve()
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('username')
        return Promise.resolve()
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('username')
            return Promise.reject()
        }
        return Promise.resolve()
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('username')
            ? Promise.resolve()
            : Promise.reject()
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
}
