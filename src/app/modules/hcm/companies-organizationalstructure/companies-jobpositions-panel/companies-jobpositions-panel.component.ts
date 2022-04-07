//modules
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
//models
import { companyjobposition } from '../../shared/models/masters/company-jobposition';
import { companymtjobposition } from '../../shared/models/masters/company-mtjobposition';
import { companylevel } from '../../shared/models/masters/company-level';
import { JobPositionViewModel } from '../../shared/view-models/job-position-viewmodel';
//filters
import { companylevelsfilter } from '../../../hcm/shared/filters/company-levels-filter';
//services
//import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from '../../../hcm/shared/services/company.service';
import { MessageService, SelectItem } from 'primeng/api';

//Theme
import { EditorModule } from 'primeng/editor';
import { companymtjobpositionsfilter } from '../../shared/filters/company-mtjobpositions-filter';
import { element } from 'protractor';

 
@Component({
  selector: 'app-companies-jobpositions-panel',
  templateUrl: './companies-jobpositions-panel.component.html',
  styleUrls: ['./companies-jobpositions-panel.component.scss']
})

export class CompaniesJobpositionsPanelComponent implements OnInit {

  constructor(private messageService: MessageService,
    private actRoute: ActivatedRoute,
    private companyService: CompanyService) { }
    

  @Input() showDialog: boolean = false;
  @Input() jobin: companyjobposition = new companyjobposition;
  @Input() jobins: JobPositionViewModel[];
  @Input() levelins: companylevel[];
  @Input() mTJobs:companymtjobposition[];
  @Input() showObligatory: boolean;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate: EventEmitter<companyjobposition> = new EventEmitter<companyjobposition>();

  //@ViewChild("mTJDropdown") mTJDropdown: Dropdown;
  
  levelin: companylevel = new companylevel();

  dropDownMTJobs: companymtjobposition[] = [];

  companymtjobpositionsFilters: companymtjobpositionsfilter = new companymtjobpositionsfilter();
  companylevelsFilters: companylevelsfilter = new companylevelsfilter();

  //Jobs: companyjobposition[]; Esto que hace aquí??
  aux: number = this.jobin.hierarchicalLevel;
  submitted: boolean;
  error: boolean;

  ngOnInit(): void {
  
   //this.onloadCompanyMTJobPosition();
   this.onLoadInitial();
   this.submitted = false;
  }

  onLoadInitial(){
    if(this.jobins != undefined){
      this.jobins.sort((a, b) => a.name.localeCompare(b.name)); //ordena por nombre
    }
  }

  saveJob(): void {
    this.error = false;
    if(this.jobin.name == "" || this.jobin.hierarchicalLevel == 0 || this.jobin.mtJobPosition == 0 || (this.showObligatory && this.jobin.mainJobPosition == 0)){  //si faltan campos requeridos
      this.error = true;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe completar los campos requeridos" });
    }
    if(this.jobin.fixedPositions == null){
      this.jobin.fixedPositions = 0;
    }
    if(this.jobin.temporaryPositions == null){
      this.jobin.temporaryPositions = 0;
    }
    if(this.jobins.length > 0){      //si existen cargos creados
      var aux = this.levelins.find(x => x.id == this.jobin.hierarchicalLevel);             //tomo el nivel del cargo a crear
      if(aux){  // si se eligió el nivel del cargo
        var levelJobin = aux.level; //tomo el número de nivel
        var father = this.jobins.find(x => x.id == this.jobin.mainJobPosition);  //y el nivel de su cargo padre
        if(father){  //si el cargo a crear se le asignó un cargo padre
          var levelFather = father.idHierarchicalLevel
          if(levelJobin <= levelFather){   //si el cargo padre tiene un nivel igual al cargo hijo
            this.error = true;             //retorna error
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El cargo padre debe tener un nivel superior" });
          }
      
        }
        
        var childrens = this.jobins.filter(x => x.mainJobPosition == this.jobin.id);  //obtengo los hijos del cargo, si se trata de una edición
        if(childrens.length > 0){
          var errorChildren = false;        //inicializo
          childrens.forEach(element =>{     //recorro el arreglo buscando si se cambió el nivel del cargo por uno igual o menor al de  alguno de sus hijos
            if(this.levelins.find(x => x.id == element.hierarchicalLevel).level <= levelJobin){
              errorChildren = true;         //retorna error
            }
          });
  
          if(errorChildren){      //ajusta la variable principal de error
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El cargo posee hijos con niveles mayores o iguales al que se desea cambiar" });
            this.error = true;
          }
        }
      }
    }
    
    if(this.error){
      this.submitted = true;
    }
    else{
      //this.jobin.mTJobPosition = this.mTJDropdown.value;
      this.submitted = false;
      this.onUpdate.emit(this.jobin);
      // if(this.levelins.find(x => x.id == this.aux).level == 1){
      //   this.showObligatory = false;
      // }else{
      //   this.showObligatory = true;
      // }
      // this.showObligatory = undefined;
    }
  }

  hideDialog(el): void {

    console.log(el);
    el.hide();
    this.submitted = false;
    this.showDialogChange.emit(false);
    // if(this.levelins.find(x => x.id == this.aux).level == 1){
    //   this.showObligatory = false;
    // }else{
    //   this.showObligatory = true;
    // }
    // this.showObligatory = undefined;
  }

  upDateJobPosition(e){
    //console.log(this.levelins);
     if(this.levelins.find(x => x.id == e.value).level == 1){
       this.showObligatory = false;
     }else{
      this.showObligatory = true;
    }
  }

  uploadDropdown(e){     
    console.log(this.jobin.mtJobPosition);
    this.dropDownMTJobs = this.mTJobs.filter(x => x.name.search(e) != -1);
  }
}
