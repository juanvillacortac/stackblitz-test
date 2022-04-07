import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { Person } from 'src/app/models/users/Person';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UsersService } from '../../shared/users.service';
import { FileUpload } from "primeng/fileupload";
import { DialogsService } from "../../../common/services/dialogs.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  private defaultURL = `https://ui-avatars.com/api/?name=${this.name}&background=17a2b8&color=fff&rounded=true&bold=true&size=200`
  private file: File = undefined;

  @Input() person: Person;
  @ViewChild('fileUpload') fileUpload: FileUpload;

  get defaultImageSource() {
    return this.person?.image
      ? this.person.image
      : this.defaultURL
  }
  get name() { return this._authService.entityName; }

  get isExternalUser() { return this._authService.userType == 2; }
  
  constructor(
    private _authService: AuthService,
    private _usersService: UsersService,
    private _dialogsService: DialogsService) { }

  ngOnInit(): void {
  }

  uploaderFile(event) {
    this.file = event.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event: any) => {
        this.person.image = event.target.result;
        this.fileUpload.clear();
        this.sendImageToService();
      }
    }
  }

  validateFile(event) {
    const type = event.files[0].type;
    if (type != "") {
      if (this.isUnsupportedFormat(type)) {
        this.showImageErrorDialog('Formato de archivo no permitido');
      }
    } else {
      this.showImageErrorDialog('Error al cargar la imagen');
    }
  }

  private sendImageToService() {
    this._usersService.saveUserImage(this.file)
      .then(result => this.person.image = result)
      .catch(error => this._dialogsService.errorMessage("Error cargando imagen", error.message));
  }

  private isUnsupportedFormat = (format) => !['jpg', 'jpeg', 'gif', 'png', 'webp','jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/webp'].includes(format);

  private showImageErrorDialog(msg) {
    this._dialogsService.errorMessage('Carga de imagen', msg);
  }
}
