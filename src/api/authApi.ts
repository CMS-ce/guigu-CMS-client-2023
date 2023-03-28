import { AccessToken, User } from '@/types/user'
import request from '@/utils/request'

const reqLogin = (username: string, password: string) =>
    request.post<AccessToken>('/auth/login', { username, password })

const reqAuthProfile = ()=>{
    request.get<User>(`/auth/profile`)
}
export default {
    reqLogin,reqAuthProfile
}
