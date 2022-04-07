import { Injectable } from '@angular/core';
import { NgxImageCompressService, DOC_ORIENTATION } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class ImageCompressorService {

  constructor(private imageCompressService: NgxImageCompressService) { }

  compressImage(image: string, filename: string): Promise<File>  {
    return new Promise((resolve) => {
      this.imageCompressService.compressFile(image, DOC_ORIENTATION.DownMirrored, 50, 50)
      .then(compressedFile => 
        resolve(this.dataURLToFile(compressedFile, filename)));
    });
  }

  private dataURLToFile(dataURL: string, filename: string) {
    var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

}