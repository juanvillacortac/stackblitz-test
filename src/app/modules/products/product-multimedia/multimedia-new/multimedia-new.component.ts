import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MultimediaProduct } from 'src/app/models/multimedia/multimediaproduct';
import { MultimediaProductFilter } from 'src/app/modules/multimedia/shared/filters/multimediaproductfilter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { MultimediaproductService } from 'src/app/modules/multimedia/shared/services/multimediaproduct.service';
import { MultimediaType } from 'src/app/models/multimedia/common/multimediatype';
import { CommonService } from 'src/app/modules/multimedia/shared/services/common/common.service';
import { DatePipe } from '@angular/common';
import { MultimediaFormat } from 'src/app/models/multimedia/common/multimediaformat';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { ImageCompressorService } from 'src/app/modules/common/services/image-compressor.service';

@Component({
  selector: 'multimedia-new',
  templateUrl: './multimedia-new.component.html',
  styleUrls: ['./multimedia-new.component.scss'],
  providers: [DatePipe]
})
export class MultimediaNewComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("idproduct") idproduct: number = 0;
  @Input("imgCount") imgCount: number = 0;
  @Input("vidCount") vidCount: number = 0;
  @Input("type") type: number = 0;
  @Output("onSearch") onSearch = new EventEmitter<MultimediaProductFilter>();
  _multimediaproduct: MultimediaProduct;
  uploadedFiles: MultimediaProduct[] = [];
  multimediaTypes: MultimediaType[] = [];
  multimediaTypeSelect: SelectItem[] = [];
  multimediaType: number = -1;
  files: File[] = []
  submitted: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  _validations: Validations = new Validations();
  disabledButtonSave: boolean = false;
  @ViewChild("fileupload") fileupload: any;
  uploadedImage: any;

  constructor(private _multimediauseservice: MultimediaproductService,
    private _commonservice: CommonService,
    private messageService: MessageService,
    private readonly loadingService: LoadingService,
    private readonly imageCompressorService: ImageCompressorService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.multimediaType = this.type == 0 ? 1 : 2;
    this.submitted = false
    this._commonservice.getMultimediaTypebyfilter()
      .subscribe((data) => {
        this.multimediaTypes = data;
        let aux: MultimediaType[] = []
        aux[0] = data[0]
        aux[1] = data[1]
        this.multimediaTypeSelect = aux.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  async onUpload(files) {
    if ((this.type == 0 && (files.length + this.imgCount) > 30) || (this.type == 1 && (files.length + this.vidCount) > 5)) {
      if (this.type == 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Superó el límite de 30 imagenes guardadas." });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Superó el límite de 5 videos guardados." });
      }
    } else {
      if (files.length == 0 && this.uploadedFiles.length == 0) {
        if (this.type == 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe añadir al menos un archivo multimedia." });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe añadir al menos un archivo multimedia." });
        }
      } else {
        this.loadingService.startLoading('wait_loading');
        for (let file of files) {
          let multi = new MultimediaProduct();
          multi.name = file.name.split('.')[0] + " " + this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
          multi.weight = file.size / 1024;
          multi.id = -1;
          multi.productId = +this.idproduct;
          multi.multimediaFormat = new MultimediaFormat();
          multi.predetermined = false;
          for (let mtype of this.multimediaTypes) {
            if (mtype.id == this.multimediaType) {
              for (let mformat of mtype.multimediaFormat) {
                if (file.type.includes(mformat.name.toLowerCase())) { 
                  multi.multimediaFormat.id = mformat.id;
                  multi.multimediaFormat.name = mformat.name + " " + this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
                  multi.multimediaFormat.multimediaType = new MultimediaType();
                  multi.multimediaFormat.multimediaType.id = mtype.id;
                  multi.multimediaFormat.multimediaType.name = mtype.name;
                  multi.multimediaFormat.multimediaType.multimediaFormat = null;
                }
              }
            }
          }
          await this.getBase64(file)
          .then(data => multi.fileAsBase64 = data.toString());

          await this.imageCompressorService.compressImage(multi.fileAsBase64, multi.name)
          .then(compressedFile => multi.file = compressedFile);

          await this._multimediauseservice.saveUserImage(multi.file)
          .then(url => multi.url = url);

          this.uploadedFiles.push(multi);
        }
        this.onClear();
        this.disabledButtonSave = false;
        this.submitted = true;
        this._multimediauseservice.postMultimediaProduct(this.uploadedFiles).subscribe((data: number) => {
          if (data > 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.loadingService.stopLoading();
            this.onSearch.emit(new MultimediaProductFilter());
            this.showDialog = false;
            this.submitted = false;
          } else if (data == -1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado" });
            this.submitted = false;
            this.loadingService.stopLoading();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el uso de multimedia" });
            this.submitted = false;
            this.loadingService.stopLoading();
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el uso de multimedia" });
          this.submitted = false;
          this.loadingService.stopLoading();
        });
      }
    }

  }

  uploadHandler(event) {
    for (let file of event.files) {
      this.files.push(file);
    }
    this.onUpload(event)
  }

  onClear() {
    //this.disabledButtonSave = true;
    this.files = [];
  }

  hideDialog(): void {
    this._multimediaproduct = new MultimediaProduct();
    this._multimediaproduct.active = true;
    this.uploadedFiles = []
    this.multimediaTypes = []
    this.files = [];
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  saveMultimediaProduct() {
    this.onUpload(this.fileupload._files);
  }



}