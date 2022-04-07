export class Phone {
    id: number;
    name?: string;
    code?: string;
    isActive?: boolean;
    idEntity: number;
    idPhoneType: number;
    phoneType: string;
    phoneNumber: string;
    idCountry: number;
    prefix: string;

    constructor() {
      this.code = ''
      this.id = -1
      this.idCountry = -1
      this.idEntity = -1
      this.idPhoneType = -1
      this.isActive = false
      this.name = ''
      this.phoneNumber = ''
      this.phoneType = ''
      this.prefix = ''
    }
}
