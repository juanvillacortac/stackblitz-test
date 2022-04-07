import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Category } from 'src/app/models/masters-mpc/category'
import { CategoryService } from '../../../../shared/services/CategoryService/category.service';
import { CategoryFilter } from '../../../../shared/filters/category-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../../../shared/Utils/Validations/Validations';

@Component({
  selector: 'app-categoryleveldown',
  templateUrl: './categoryleveldown.component.html',
  styleUrls: ['./categoryleveldown.component.scss']
})
export class CategoryleveldownComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_category") _category : Category;
  @Input("filters") filters : CategoryFilter;
    submitted: boolean;
    refreshPOT : CategoryFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  _validations: Validations = new Validations();
  
  _categorybrothers: SelectItem[];
  
  constructor(private _categoryService: CategoryService, 
    private messageService: MessageService,
    ) { }

  ngOnInit(): void {
    var filter = new CategoryFilter();
    filter.idParentCategory = this._category.idParentCategory;
    filter.active = 1;
    this._categoryService.getCategorys(filter)
      .subscribe((data) => {
        var cat = data.find(element => element.id == this._category.id);
        data.splice(data.indexOf(cat),1);
        
        this._categorybrothers = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
    
  }




  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._category.idParentCategory = 0;
  }
  levelDown(): void{
    this.submitted = true;
    if(this._category.idParentCategory > 0 && this._category.idParentCategory != undefined){
      this._category.active = true;
      this._categoryService.changeLevelCategory(this._category).subscribe((data: number) => {
        if(data >= 0) {
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Categoría nivelada con éxito"});
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this._categoryService.gettreeCategory(this.refreshPOT = new CategoryFilter()).subscribe((data: Category[]) => {
            this._categoryService._categoryList = data;
          });
          this.submitted = false;
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al bajar de nivel la categoría"});
        }
      }, (error: HttpErrorResponse)=>{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al bajar de nivel la categoría"});
      });
       
      
    }



  }

}
