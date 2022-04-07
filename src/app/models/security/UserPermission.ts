import { UpdatePermission } from "./UpdatePermission";

export class UserPermission {
    IdUser: number;
    IdUserModifing: number;
    IdCompany: number;
    IdOffice: number;
    PermissionsUpdate: UpdatePermission[];
}
