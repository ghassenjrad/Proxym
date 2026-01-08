
export type UserDto = {
    name: string;
    email: string;
    password: string;
    // optional role when created by an admin
    role?: string;
}
