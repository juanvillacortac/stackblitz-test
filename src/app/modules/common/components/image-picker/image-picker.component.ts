import { compileNgModule } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {

  @Input() imageSrc: string;
  imageUrl: SafeUrl;
  defaultImage: SafeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl('/assets/layout/images/dafeult-banks-image.jpg');
  @Output() selectImage = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer, private messageService: MessageService) { }

  ngOnInit(): void {
    this.imageUrl = this.imageSrc ? this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${this.imageSrc}`) : this.defaultImage;
    console.log(this.imageUrl);
  }

  onImageNotFound(e) {
    this.imageUrl = this.defaultImage;
  }

  onSelectIdImage(input: any) {
    const file: File = input.target.files[0];
    if (this.validateImage(file)) {
      // Convert Image to Base64
      const fileReader: FileReader = new FileReader();
      fileReader.onload = this._handleReaderLoaded.bind(this);
      fileReader.readAsDataURL(file);
    } else {
      this.imageUrl = this.defaultImage;
    }
  }

   _handleReaderLoaded(readerEvt) {
    const base64textString = readerEvt.target.result;
    this.imageUrl = (base64textString) ? base64textString : this.defaultImage;

    const resultBase64 = base64textString.substr(base64textString.indexOf(',') + 1);
    this.selectImage.emit(resultBase64);
  }

  validateImage(file: File) {
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
        if (file.size > 3000000) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La imagen ingresada excede el tamaño permitido'});

          return false;
        }
      }
    }

    return true;
  }
}
