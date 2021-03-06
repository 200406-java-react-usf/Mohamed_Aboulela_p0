export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: string
}

export interface AstrologySchema {
    id: number,
    title: string,
    body: string,
    astrology_id: number
}