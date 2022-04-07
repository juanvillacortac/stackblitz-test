export interface ChangePassword {
    idUser: number;
    mainEmail?: string;
    password?: string;
    newPassword: string;
    userModified?: number;
}
