export type User = {
    id: string
    username: string
    phone: string
    email: string
    role: {
        id: string
        name: string
        menus: string[]
    }
}

export type AccessToken = {
    access_token: string
}
