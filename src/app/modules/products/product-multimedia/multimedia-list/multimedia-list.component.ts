import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultimediaProduct } from 'src/app/models/multimedia/multimediaproduct';
import { Multimedia } from 'src/app/models/products/multimedia';
import { ProductMultimediaUse } from 'src/app/models/products/productmultimediause';
import { MultimediaUse } from 'src/app/modules/masters-mpc/shared/view-models/multimedia-use.viewmodel';
import { IdMultimedia } from 'src/app/modules/multimedia/shared/filters/idmultimedia';
import { MultimediaProductDelete } from 'src/app/modules/multimedia/shared/filters/multimediaproductdelete';
import { MultimediaProductFilter } from 'src/app/modules/multimedia/shared/filters/multimediaproductfilter';
import { MultimediaproductService } from 'src/app/modules/multimedia/shared/services/multimediaproduct.service';
import { ProductmultimediaService } from '../../shared/services/productmultimedia/productmultimedia.service';

@Component({
  selector: 'multimedia-list',
  templateUrl: './multimedia-list.component.html',
  styleUrls: ['./multimedia-list.component.scss']
})
export class MultimediaListComponent implements OnInit {

  @Input("activeTab") activeTab: number;
  @Output("refreshChangeMain") refreshChangeMain = new EventEmitter<number>();
  @Input("loading") loading: boolean = true;
  @Input("multimediaProducts") multimediaProducts: MultimediaProduct[];
  @Output("onSearch") onSearch = new EventEmitter<MultimediaProductFilter>();
  @Input("type") type: number = 0;
  @Input("selectedPredetermined") selectedPredetermined : MultimediaProduct;
  multimedias : Multimedia[] = new Array<Multimedia>()
  idMultimedia : number = 0
  imgTab: boolean = false
  vidTab: boolean = false
  docTab: boolean = false
  audTab: boolean = false
  useDialog: boolean = false
  detailDialog: boolean = false
  List_newProductMultimediaUse: any[] = []
  pos: number = 0
  deleted: boolean = false;
  selectedRemoves: MultimediaProduct[] = [];
  visibilitySlide: boolean = false;
  viewImageSlide: string = "";
  listProductUseMultimedia: MultimediaProduct[] = [];

  constructor(private _multimediaproductservice: MultimediaproductService, 
    private _productmultimediaservice: ProductmultimediaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }



  refresh(){
    this.onSearch.emit(new MultimediaProductFilter());
  }

  addMultimediaUse(id: number, listProductMultimedia: ProductMultimediaUse[]){
    this.idMultimedia = id
    this.List_newProductMultimediaUse = [];
    listProductMultimedia.forEach(element => {
      this.List_newProductMultimediaUse.push(
        element.multimediaUse.id,
      )
    });
    this.useDialog = true

  }

  viewDetail(idMultimediaProduct: number){
    for (let i = 0; i < this.multimediaProducts.length; i++) {
      if(this.multimediaProducts[i].id == idMultimediaProduct){
        this.pos = i;
      }
    }
    this.detailDialog = true

  }

  ViewImg(multimediaproduct: MultimediaProduct){
    this.visibilitySlide = true;
    console.log(multimediaproduct);
    console.log(this.type);
    this.viewImageSlide = multimediaproduct.url;
  }

  closeImg(){
    this.visibilitySlide = false;
    this.viewImageSlide = "";
  }

  prevImg(){
    var totalimages = this.multimediaProducts.length - 1;
    var indeximage = this.multimediaProducts.findIndex(x => x.url == this.viewImageSlide);
    if (indeximage == 0) {
      indeximage = totalimages;
      this.viewImageSlide = this.multimediaProducts[indeximage].url;
    }else{
      indeximage = indeximage - 1;
      this.viewImageSlide = this.multimediaProducts[indeximage].url;
    }
  }

  nextImg(){
    var totalimages = this.multimediaProducts.length - 1;
    var indeximage = this.multimediaProducts.findIndex(x => x.url == this.viewImageSlide);
    if (indeximage == totalimages) {
      indeximage = 0;
      this.viewImageSlide = this.multimediaProducts[indeximage].url;
    }else{
      indeximage = indeximage + 1;
      this.viewImageSlide = this.multimediaProducts[indeximage].url;
    }
  }

  removeChip(id: number){
    this._productmultimediaservice.deleteProductMultimediaUse(id).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Eliminado', detail: "Uso multimedia eliminado satisfactoriamente"});
        this.refresh()
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "No se pudo eliminar el uso multimedia"});
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "No se pudo eliminar el uso multimedia"});
    });
  }
  removeMultimedia(id: number){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Esta seguro que desea eliminar estos elementos?',
      accept: () => {
        this.remove();
      },
    });
      
  }

  remove(){
    this.deleted = true;
    this._multimediaproductservice.deleteMultimediaProduct(this.selectedRemoves).subscribe((data: number) => {
      if(data == 0) {
        this.messageService.add({severity:'success', summary:'Eliminado', detail: "Multimedias eliminados satisfactoriamente"});
        this.deleted = false;
        this.selectedRemoves = [];
        this.refresh()
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "No se pudo eliminar los multimedias"});
        this.deleted = false;
      }
    }, (error: HttpErrorResponse)=>{
      this.deleted = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "No se pudo eliminar los multimedias"});
    });
  }

  changePredetermined(){
    this._multimediaproductservice.predeterminedMultimediaProduct(this.selectedPredetermined).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.onSearch.emit(new MultimediaProductFilter());
        this.refreshChangeMain.emit();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el preterminado" });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el predeterminado" });
    });
  }

  getMultimediaUses(productMultimediaUse){
    if (productMultimediaUse.length > 5) {
      return productMultimediaUse.slice(0,5);
    }else{
      return productMultimediaUse;
    }
    
  }

  showMore(op, event, productMultimediaUse){
    op.toggle(event);
    this.listProductUseMultimedia = productMultimediaUse.slice(5,productMultimediaUse.length);
  }

  ngOnInit(): void {
    switch(this.activeTab) { 
      case 0: { 
        
        break; 
      } 
      case 1: { 
        // this.multimedias = new Array<Multimedia>()
        // for (let index = 0; index < 5; index++) {
        //   let multi = new Multimedia()
        //   multi.id = index
        //   multi.name = 'video'+index
        //   multi.link = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUPEQ8PDxISDw8QEQ8PDw8PDxEPDxAQGBQZGRgUGBgcIS4lHB4sHxgYNEYmLzAxNjU1GiQ7QDszQi40NTEBDAwMEA8QHhISGjEhISQxNDQxNDQ0NjQxNDU0NDQxNDQ0NDQ0NDQ0MTQ1NDQ0NDQ0NDE0NDQ0NDQ0NDQ0MTE0NP/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAQIDBQYHBAj/xABIEAABAgICCg8FBwIHAAAAAAAAAQIDEQQSBRMXNVFUcZGTowYHITFBUlNhcoGSsbKz0RQyVXPBIjNCgqGi0iNkFSRDYoTh4v/EABoBAQACAwEAAAAAAAAAAAAAAAABAgQFBgP/xAA7EQEAAQICBQUNCAMAAAAAAAAAAQIRAwQFEiExURRBkbHRExUiMlJTYWJxgaHB4TM0QnKSouLwI0Px/9oADAMBAAIRAxEAPwDsxidkdlfYKNEpNS2IxWIra1VVrOlv9ZljV9sW9tIywvGgGBum7lb2R9XjV0kLpyYq7SIcpitRXKqpPe7iEhpgQtZDq901MVd20JumJiru2hyi1pgQqqJgQWHVrpiYq7toLpaYsvbQ5VUTAhNRMCZhYdVulJiy9tBdJTFl7aHK6iYEzEVEwILDq10j+2XtoLpH9svbQ5SrEwEVEwCw6vdITFl7aC6SmLL20OTq1MBTUTALDrN0lMWXtoLpSYsvbQ5LUTAUq1CLDrV0tMWXSIeJ+28xFVEoj1ROG2NRFOXRpIksPceeomBMxNh1e6+3E36RouvsxR+kacoqJgTMKiYEzEWHV7r7cTfpGi6+zFH6RpyiomBMxFRMCZhYdYuvsxR+kaLr7MUfpGnJ7WmBMwqJgTMLDrF19mKP0jRdfZij9I05PUTAmYWtMCZhYdYuvsxOJpGi6+zE4mkacntaYEzEWtMCCw6zdfZij9I0XX2YnE0jTk9rTAmYWtMCZhYdYuvsxN+kaLr7MTfpGnJ6iYEzC1pgTMTYdYuvsxR+kaLr7MTiaRpye1pgTMRa0wIRYdZuvsxOJpGmQsFtmNptKgUVtFexYz1ZXc9qo2TVdOSb+8cWqJgQ2PYCkrKUCXHd4HgfRQAISGr7Yt7aRlheNDaDV9sW9tIywvGggcMie8vUEEX3lyJ3EIWQqQqQpJAkkiYmBVMiZB6IFHV+9uN4ykVVRTF5Xw8KvFq1KIvKwFMi2htTfm7pfY7itKOzipncpjzmqOa7aUaFzE+NNMe+Z6osxJCqZlILeI3MSkNvFb2UK8rjyXpGg8TnxI6JYNXFCuNgqt4rey0mXMmYjlfq/FbvFV52P0/Vqjok1VSmsbbm7JO7zDlfq/H6J7xz539v8mo1iKxt81w/qJrh/Ucr9X4/RPeOfO/t/k1GsKxtuYS5kzDlceT8Ud4qvO/t/k1KsJm2VG8VvZaUrBYu+xnYaTyuPJR3jr85HR9WqlRsy0ZnJw+yUrQoa/6beqaE8rp4KzoPF5q6fj2NZKjPusXCXearei5V7zwUqxLmJWhrXam+n409S9OYoq2bmNjaKzOFTrWiqPRN/haJ62PAB7taAAAAABn9gV9aB03eW8wBsGwK+tA6bvA8D6JABVIattjXtj5YXjQ2k1bbGvbHywvGggcMi+8uRCEJi+8uRChCyFwkoRSUUCokpEwL9HhV3InBvrkMtvbm8h4rHJ9lzsKpPIh65mvzFd67cHVaJy8YeXiu22vb7ubtVApmJng2ioFMxMCoFMxMCoETImBUCmYmBUCmYmBUCmYmBUCJkTAqBEyJgYmzNGRFSK1JI5ZPTgrcC9ZjDZKVCtjHtwt/cn2k7jWUM/LV61Fp5nLaWwIwsfWpi0VRf37p/vG6oAGQ1QAABsGwK+tA6bvLea+bBsCvrQOm7y3gfRIAKpDVtsa9lIywvGhtJq22PeykZYXjQQOFxl+0uRCgmN7y5EKUUshUSUzEwK5lUy3MTAzFF3IbEyrnUuzLcH3WdBv1KzVVTeqZdxgU6uFRTwiOpMxMgFXqmYmQAJmJkACZg2rYpscZZCBSFc90OLDcxsNzd1u6irJzeFJ5FMdZnY3HoaqsRleHwRYc3slhVd9vWXnDq1dbmY8ZrCnFnC1rVRzTs6P7f0MNMTIUTKMhMxMgATMTIAEzEyABMxMgAVIvehrERsnOTA5UzGzIa5S0lFiJ/vVc6mVlZ2y0mm6f8dE+mY6Yv8lsAGa50AAA2DYFfWgfMd5bzXzP7A760Dpu8t4H0UACqQ1bbHvbSMsLxobSartkXtpGWF40EDhUb3upCkmN73UhSWQqImQSBMyFUiYUInczrPdbkb3EzIRd7I0Gpl3kboTMTIASmYmQAJmTMpAS6TtW/dUr5kPwqby9iORUVJovApou1b91SvmQ/Cpvpn4HiQ5DSX3qv3dUNOs5sKgx6z4X9CKs1mxs2KvO36pLrNAsrYKPQ1VYjKzOCKz7UPrX8PXI7geakUZr0XcTd3F3JovMqcJFeBTVtjY9ctpPGwfBq8Kn07/dP/XBZkTOlWa2Fwoqq6D/AJeIu7JE/ou6vw9WY0Sytho1EWUZiynJsRu6x2R3BkWSmJXhVUb2+y+dwcfZTNp4Tv8Ar7rvBMTImCjLTMTIAEzEyABVMwFkfvon5e5DOmCsj98/8vhQyMt40+xqNNfYU/m+UrAAM5zQAABn9gd9aB03eW8wBsGwK+tA6bvLeB9EgAqkNV2yL2UnLC8aG1Gq7ZN7KTlheNBA4RH97qQomVR/e6kKJlkKpkEEgVEKQQ5QidzPIu9kaQRPeyNEzVO8jckETEyEpBExMCQRMTA6ZtV/dUv5kPwqb6aDtV/dUv5kPwqb8Z+D4kOR0j96r93VACzGjNhtV73IxjUm5zlRrWphVV3jTLObYEKFNlES3v3q7ptgpk4XfonOXqrpp3y8MHAxMabYdN+qPbLcaVFZDY58VzWMak3OeqNanPNTQbP7M4SVoVFYlIRUVqvitnCyI1d1/XJMppdlbMR6Y6tSIjnyWbWzqsZ0WJuJl3zwGLXmJnxdje5bRFFHhYs608ObtnqXIj6yq6SJNVWTWo1qcyIm8hQRMTMdt0giYmEpBExMCTC2Q+9f+XwoZmZhbIfev/L4UMnLeNPsajTP2FP5o6pWQAZrmgAADYNgV9aB03eW8182DYFfWgfMd5bwPokAFUhqm2Teyk5YXjQ2s1TbJvZScsLxoIHB4/vdSfUoKo3vdSfUoLISJkEgJkKSQCY2M4xZtbztb3EluCs2M6DS4auY2u4oqvTE8YjqAARZe4ABYuAAWHSdq6IjYNMc5UaiRIaqrlRERKq7qqe2zmz6DAmyjJ7RE3UrTlBauX8fVuc5yxI7ka6GjnIxyo5zUcqNc5Ekiqm8qlB7RizFOrDW1aNw8TGqxcSb35t0brbZ39FvayVlrO0imunHiK5JzbDb9mGzIxNzrWa85jQDym8thTTTTTq0xaI4AAIstcAAsXAALFwACxcMNTV/qxMv0QzKGDpKziROkveZOWjwp9jTaZn/ABUR63ylQADMc6AAAbBsCvrQOm7y3mvmf2BX1oHzHeW8D6KABVIartk3spOWF42m1GqbZV66TlheNogcEjb/AFJ9SkmLv9Sd6kFkEyZkACQQAMtQ3Ths5pt/cXpnisbE3HN4v20yHsma/Ei1cw7DJYmvl6J9FujYmYmRMTPNlJmJkTEwJmJkTEwJmJkTEwJmJkTEwJmJkTEwJmJkTEwJmJkTEwJmJkTEwJRd3rQwTlms8O7+pl6REqscvCjZJ17hhjLy0bJloNNYl6qKOETPTs+UqgAZLSAAAGwbA760Dpu8t5r5sGwK+lA+Y7y3gfRIAKpDU9su9dJywvMabYantmXrpOWF42iBwSLvpkTvUgRN9Mid6kFkJBAAkAgCuFFqOR2DfTCZZjkVEVFm1TDFUOK5izassKcCnji4Wvtje2ORz85e9NUXpn4Tx7Y6ODMA8LbIcZuZ0i4lObgcnUhjThVxzN5TpDK1fjiPbs63qB50prOMvZcT7Uzjpmd6FdSrg9YzeXn/AGU/qjtXwWfaWcdv7/QW9nGTMpGrVwWjMYM/jp/VHavAtW9vGbnUW5vGZnUas8E92w/LjphdBbtzeO3tC3N4zO0RaeCe60eVHTC4C1bm8ZudR7QzjN/UnVngju2F5cdMLoLXtLOMmZxHtTON+jydSrgrynB85T0wvA8601nG/a4haaznzE9zr4KznMvG/Ep6YekJzHkWnt4GquWSfQ80alOfubzeKm91lqcGqfQx8XSmXojwZ1p4R2z9fYqp0euqNb7reHCp5yCTMppimLQ5vGxqsaua6t8gALPIAAA2DYFfSgfMd5bzXzYNgV9KB8x3lvA+iCQCqQ1PbMvXScsLxtNsNT2zb10nLC8bRA4I/fTInepSXWw2u959Xcl7qu7iu0M5TVuLIecHotDOU1bx7OzlNW4DzgvvhMTcWJq3FNrZymreBaBdtbOU1bxa2cpq3gWgXbWzlNW8WtnKat4FoF6ozlNW8VGcrq3hKyC9UZyureKjOV1bwhZBeqM5XVvFRnK6t4FgkyDbEuVGuakRzXNa9rm0eI5qtVEVFmnMqZyzHoiQ1RsR7mOVKyI+DEaqph3QWeUF6ozldW8VGcrq3gWQXqjOV1bxUZyureBZBeqM5XVvFRnKat4FgkuWtnKatxNRnKat4FoF21s5TVvFrZymreBaBdqM5TVuFRnKatwFoF2ozlNW4VGcpq3AWjYNgV9KB8x3lvMJUZymrcZvYFfWgyWaWx6TlKf9N4H0QSQSVSGK2Q2KbTqLGor1VqRGyRyLJWO32uTIsllwykSAOb3IH47qU9SbkL8d1KeoAQm5E/HdT/6FyN+O6n/sAC2/aeeqqvt8p8Fob6kXHH4+ugb6kAi6U3HH4+ugb6kXHH4+ugb6gC4XHH4/qG+ouORMf1DfUAXFLtp56b9kJZYCJ9SLkD/iKaFv8gBcTcgd8QTQt9Rcgd8RTQt9QBcRcgf8RTQt/keSym1etFgxKQ+nq5sNEc5sOAxzlRXIm4iuTCATAwEPY3BdupS6Sn/FhYJ8oX7G7EYdJjsozKZHa99aq59FhIxKrVcs1r8ygFkNjuQP+IpoW/yFyB/xFNC3+QBS6U3IHfEU0LfUXIHfEU0LfUgC6C5A74imhb/IruOPx/UN9QBdJcciY/qG+ouORMf1DfUAXC44/H10DfUm44/H10DfUgC4m44/H10DfUXHH4+ugb6kAXC44/H10DfUm44/H10DfUgC4m44/H10DfUy+xXa0/w+lw6VFpK0i1o+1sqWtGvVJVlku7uK7c558AAuOkAAkf/Z"
        //   multi.multimediauses = new Array<MultimediaUse>()
        //   for (let i = 0; i < 1; i++) {
        //     let use : MultimediaUse = new MultimediaUse()
        //     use.name = 'uso'+i
        //     use.id = i
        //     multi.multimediauses.push(use)
        //   }
        //   this.multimedias.push(multi)
        // } 
        break; 
      }
      case 2: { 
        // this.multimedias = new Array<Multimedia>()
        // for (let index = 0; index < 7; index++) {
        //   let multi = new Multimedia()
        //   multi.id = index
        //   multi.name = 'documento'+index
        //   multi.link = "data:image/jpeg;base64,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"
        //   multi.multimediauses = new Array<MultimediaUse>()
        //   for (let i = 0; i < 5; i++) {
        //     let use : MultimediaUse = new MultimediaUse()
        //     use.name = 'uso'+i
        //     use.id = i
        //     multi.multimediauses.push(use)
        //   }
        //   this.multimedias.push(multi)
        // } 
        break; 
      }
      case 3: { 
        // this.multimedias = new Array<Multimedia>()
        // for (let index = 0; index < 1; index++) {
        //   let multi = new Multimedia()
        //   multi.id = index
        //   multi.name = 'audio'+index
        //   multi.link = "https://d500.epimg.net/cincodias/imagenes/2018/04/06/lifestyle/1523024360_679899_1523024651_noticia_normal.jpg"
        //   multi.multimediauses = new Array<MultimediaUse>()
        //   for (let i = 0; i < 3; i++) {
        //     let use : MultimediaUse = new MultimediaUse()
        //     use.name = 'uso'+i
        //     use.id = i
        //     multi.multimediauses.push(use)
        //   }
        //   this.multimedias.push(multi)
        // } 
        break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }
  /* @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    debugger;
    console.log(event);

    if (event.keyCode === 39) {
      this.messageService.add({severity:'success', summary:'Eliminado', detail: "right"});
    }

    if (event.keyCode === 37) {
      this.messageService.add({severity:'success', summary:'Eliminado', detail: "left"});
    }
  } */
  /* @HostListener('window:keydown', ['$event']) 
  onKeyUp(event) {
    switch (event.keyCode) {
      case 38:
        this.messageService.add({severity:'success', summary:'Eliminado', detail: "up"});
        break;
      case 37:
        this.messageService.add({severity:'success', summary:'Eliminado', detail: "left"});
        break;
      case 40:
        this.messageService.add({severity:'success', summary:'Eliminado', detail: "down"});
        break;
      case 39:
        this.messageService.add({severity:'success', summary:'Eliminado', detail: "right"});
        break;
    }
  } */
}
