import { Permission } from "./Permission";
import { Software } from "./Software";
import { UpdatePermission } from "./UpdatePermission";

export class Role {
    id: number;
    name: string;
    type: string;
    idType: number;
    softwares?: Software[];
    app?: string;
    idApp?: number;
    companyName: string;
    idCompany: number;
    isActive?: boolean;
    permissions: UpdatePermission[];
}
