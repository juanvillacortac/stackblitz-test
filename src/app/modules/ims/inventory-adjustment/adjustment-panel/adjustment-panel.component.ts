import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService, SelectItem } from 'primeng/api';
import { Adjustment } from 'src/app/models/ims/adjustment';
import { AdjustmentDetail } from 'src/app/models/ims/adjustment-detail';
import { Category } from 'src/app/models/masters-mpc/category';
import { UserFilter } from 'src/app/models/security/UserFilter';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { AdjustmentDetailFilter } from '../shared/filters/adjustment-detail-filter';
import { AdjustmentFilter } from '../shared/filters/adjustment-filter';
import { InventoryAdjustmentService } from '../shared/services/inventory-adjustment.service';
import { Location } from '@angular/common';
import { endWith } from 'rxjs/operators';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import * as Statuses from '../shared/services/adjustment-status-const'
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-adjustment-panel',
  templateUrl: './adjustment-panel.component.html',
  styleUrls: ['./adjustment-panel.component.scss']
})
export class AdjustmentPanelComponent implements OnInit {
  acceptGuion: RegExp = /^[a-zA-Z0-9À-ú\sñÑ_ -] *$/
  _validations: Validations = new Validations();
  submitted: boolean;
  selectedCategories: any[] = [];
  categoriesString: string;
  @Input("loading") loading: boolean = false;
  @Input("idadjustment") idadjustment: number = 0;
  @Input("_dataAdjustment") _dataAdjustment: Adjustment = new Adjustment();
  @Input("idproduct") idproduct: number = 0;
  AreaList: SelectItem[];
  ResponsableList: SelectItem[];
  AdjustmentTypeList: SelectItem[];
  CategoriesList: SelectItem[];
  _DetailProductListTemp: AdjustmentDetail[] = [];
  _selectedInventoryLocked: AdjustmentDetail[] = [];
  _AdjustmentCountList: AdjustmentDetail[] = [];
  detailaux: AdjustmentDetail;
  _IdAdjustment: number;
  _IdArea: number;
  _showdialog: boolean = false;
  _showdialogCount: boolean = false;
  model: boolean = false;
  multiples: boolean = false;
  location;
  userFilter: UserFilter = {
    idCompany: 0,
    idRole: 0,
    idSubsidiary: 1,
    idUser: 0,
    mainEmail: '',
    status: -1
  };
  previousVal: number = 0;
  previousValArea: number = 0;
  previousValType: number = 0;
  currentValType: number = 0;
  isAdjustmentCount: boolean = false;
  cont: number = 0;
  _idoffice:number=-1;
  @Input() isDisabled: boolean = false;
  @Output() btnClick = new EventEmitter();
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  isFormEdit:boolean=false;
  constructor(public _categoryservice: CategoryService,
    private _areaService: AreaService,
    private _adjustmentService: InventoryAdjustmentService,
    private messageService: MessageService,
    private _userService: UserService, private _routeActive: ActivatedRoute, private router: Router, location: Location,
    private confirmationService: ConfirmationService, public userPermissions: UserPermissions,private breadcrumbService: BreadcrumbService,
    private _selectorService: CurrentOfficeSelectorService,
    private _authService: AuthService,private _httpClient: HttpClient
  ) {
    this.location = location;
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label:  'Ajuste de inventario', routerLink: ['/ims/inventory-adjustment-list'] }
    ]);
    this._selectorService.setSelectorType(EnumOfficeSelectorType.office)
  }
  permissionsIDs = { ...Permissions };
  statusesIDs = { ...Statuses };
  _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    this._idoffice = this._Authservice.currentOffice;
    this._IdAdjustment = this._routeActive.snapshot.params['id'];
    if (this._IdAdjustment != 0) {
      this.LoadAdjustment();
    }
    this.onLoadCategorys();
    this.loadFilters();
  }

  loadFilters() {
    this._areaService.getareaList({
      id: -1,
      name: "",
      abbreviation: "",
      active: 1,
      idAreaType: -1,
      idFatherArea: -1,
      idBranchOffice: this._authService.currentOffice
    })
      .subscribe((data) => {
        this.AreaList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });
    this._adjustmentService.getAdjustmentTypeList(
      {
        Id: -1,
        Active: 1,
        Name: ""

      })
      .subscribe((data) => {
        this.AdjustmentTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });


  }

  async onLoadAdjustmentType() {
    this._adjustmentService.getAdjustmentTypeList(
      {
        Id: -1,
        Active: 1,
        Name: ""

      })
      .subscribe((data) => {
        this.AdjustmentTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });
  }
  async onLoadArea() {
    this._areaService.getareaList({
      id: -1,
      name: "",
      abbreviation: "",
      active: 1,
      idAreaType: -1,
      idFatherArea: -1,
      idBranchOffice: this._authService.currentOffice
    })
      .subscribe((data) => {
        this.AreaList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });
  }
  async onLoadCategorys() {
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory = 0;
    let category = new Category();
    category.id = -1;
    category.name = "Todas";

    this._categoryservice.getCategorys(filter)
      .subscribe((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name))
        let filterArray = [{ ...category }, ...data];
        this.CategoriesList = filterArray.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      });

  }


  Save(adjustment: Adjustment, isdetail: boolean) {
debugger
    this.submitted = true;
    if (this._dataAdjustment.idadjustmenttype > 0 &&
      this._dataAdjustment.idarea > 0 &&
      this._dataAdjustment.idresponsableuser > -1 &&
      this._dataAdjustment.idcategory >= -1 &&
      this._dataAdjustment.description != "" && this._dataAdjustment.description.trim()
    ) {
      if (this._dataAdjustment.id == -1) {
        this.confirmationService.confirm({
          message: '¿Desea guardar el ajuste con la siguiente configuración?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.SaveAdjustment(adjustment, isdetail)
          },
          reject: (type) => {
            switch (type) {
              case ConfirmEventType.REJECT:
                break;
              case ConfirmEventType.CANCEL:
                break;
            }
          }
        });
      } else {
        this.SaveAdjustment(adjustment, isdetail)
      }
    }
  }


  SaveAdjustment(adjustment: Adjustment, isdetail: boolean) {
    this.submitted = true;
    if (this._dataAdjustment.idadjustmenttype > 0 &&
      this._dataAdjustment.idarea > 0 &&
      this._dataAdjustment.idresponsableuser > -1 &&
      this._dataAdjustment.idcategory >= -1 &&
      this._dataAdjustment.description != "" && this._dataAdjustment.description.trim()
    ) {
      this._dataAdjustment.idEstatus = this._dataAdjustment.id == -1 ? this.statusesIDs.IN_PROGRESS_STATUS_ID : this._dataAdjustment.idEstatus
      this._dataAdjustment.adjustemntdetailList = this._DetailProductListTemp;
      this._dataAdjustment.idbranchoffice=this._idoffice;

      if (this._selectedInventoryLocked.length > 0) {
        this.detailaux = new AdjustmentDetail();
        this._DetailProductListTemp = this._DetailProductListTemp.map(item => {
          let val = this._selectedInventoryLocked.findIndex(i2 => i2.id == item.id)
          if (val == -1) {
            this.detailaux = item
            this.detailaux.indLocked = false;
          }
          else {
            this.detailaux = item
            this.detailaux.indLocked = true;
          }
          return this.detailaux ? { ...item } : item;
        });
      }
      else
        this._DetailProductListTemp = this._DetailProductListTemp.map(item => { item.indLocked = false; return item; });

      if (this._dataAdjustment.id == -1) {
        this._DetailProductListTemp.forEach(adjustmentDetail => {
          if (adjustmentDetail.idmotive == -1) {
            adjustmentDetail.idmotive = 0;
            adjustmentDetail.motive = "por ajustar";
          }

        });
      }
      this._dataAdjustment.idbranchoffice=this. _Authservice.currentOffice;
      this._dataAdjustment.numberitems=this._DetailProductListTemp== undefined? 0:this._DetailProductListTemp.length;
      this._adjustmentService.UpdateInventoryAdjustment(this._dataAdjustment).subscribe((data) => {
        this._dataAdjustment = data[0];
        this._DetailProductListTemp = data[0].adjustemntdetailList;
        // this._selectedInventoryLocked = this._DetailProductListTemp.filter(x=>x.indLocked == true);
        if (this._IdAdjustment == 0) {
          let link: any[] = ['/general-adjustment-panel', data[0].id.toString()];
          this.location.go(link[0] + "/" + link[1]);
        }
        if (!isdetail)
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Ajuste guardado con éxito" });
          this.isFormEdit=false;
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });
    }
  }

  SaveAdjustmentDetailEdit(data) {
    if (data.isEditDetail) {
      let objIndex = this._DetailProductListTemp.findIndex((obj => obj.id == data.adjustmentDetail.id));
      this._DetailProductListTemp[objIndex] = data.adjustmentDetail;
      this.SaveAdjustment(this._dataAdjustment, true);
    } else {
      data.adjustmentDetail.idadjustment = this._dataAdjustment.id;
      data.adjustmentDetail.idarea = this._dataAdjustment.idarea;
      if (this._dataAdjustment.id != -1) {
        this._DetailProductListTemp.push(data.adjustmentDetail);
        this.SaveAdjustment(this._dataAdjustment, true);
      } else {
        this.confirmationService.confirm({
          message: '¿Aun no ha guardado la cabecera, desea realizar la accion?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this._DetailProductListTemp.push(data.adjustmentDetail);
            this.SaveAdjustment(this._dataAdjustment, false);
          },
          reject: (type) => {
            switch (type) {
              case ConfirmEventType.REJECT:
                this._DetailProductListTemp.push(data.adjustmentDetail);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe guardar la cabecera " });
              case ConfirmEventType.CANCEL:
                return false;
            }
          }
        });
      }
    }

  }

  DeleteAdjustmentDetail(data) {
    let index = this._DetailProductListTemp.findIndex(d => d.id === data.adjustmentDetail.id); //find index in your array
    this._DetailProductListTemp.splice(index, 1);//remove element from array
    this.SaveAdjustment(this._dataAdjustment, true)
  }

  AsignAreaValue(idarea: number) {
    this._IdArea = idarea;
  }

  LoadAdjustment() {
    var _adjustmentFilter = new AdjustmentDetailFilter();
    _adjustmentFilter.id = this._IdAdjustment;
    _adjustmentFilter.idbranchoffice = this._authService.currentOffice;
    this.loading = true;
    this._adjustmentService.getAdjustmentDetail(_adjustmentFilter).subscribe((data: Adjustment[]) => {

      this._dataAdjustment = data[0];
      this._DetailProductListTemp = data[0].adjustemntdetailList;
      this._selectedInventoryLocked = this._DetailProductListTemp.filter(x => x.indLocked == true);

      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el ajuste con sus detalles." });
    });

  }


  BackToList = () => {
    if(this.isFormEdit ==true)
    {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea regresar al listado?, si tiene cambios sin guardar los mismos se perderan',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['/ims/inventory-adjustment-list']);
        },
        reject: (type) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              return false;
            case ConfirmEventType.CANCEL:
              return false;
          }
        }
      });  
    }else
    {
      this.router.navigate(['/ims/inventory-adjustment-list']);
    }
  
  }

  showmodal(multples: boolean, models: boolean) {
    this.isFormEdit ==true;
    this.model = models;
    this.multiples = multples;
    this._showdialog = true;
  }

  onSubmitOperator(data) {

    this._dataAdjustment.idresponsableuser = data.operator.id;
    this._dataAdjustment.operator = data.operator.name;

  }

  onHideOperator(visible: boolean) {
    this._showdialog = visible;
  }

  showmodalInventoryCount() {
    this.isFormEdit=true;
    debugger;
    //Este comentario
    var a = 0;
    this.currentValType = this._dataAdjustment.idadjustmenttype;

    this.previousValType = this.previousValType == 0 ? this._dataAdjustment.idadjustmenttype : this.previousValType;
    if (this.previousValType != this._dataAdjustment.idadjustmenttype) {
      //window.location.reload();
      this._dataAdjustment = new Adjustment();
      this._dataAdjustment.idadjustmenttype = this.currentValType;
      this._DetailProductListTemp = [];
      this.previousValType = this.currentValType;
    }
    if (this._dataAdjustment.idadjustmenttype == 3) {
      this._showdialogCount = true;
      this.isAdjustmentCount = true;
    }
  }

  onHideCount(visible: boolean) {
    this._showdialogCount = visible;
  }




  onSubmitCount(data) {
    debugger
    this._dataAdjustment.idphysycalcount = data.idphysycalCount;
    this._dataAdjustment.idcategory = data.idCategory;
    this._dataAdjustment.idarea = data.IdArea == -1 ? 0 : data.IdArea;
    this._dataAdjustment.description = data.description != "" ? data.description : "";
    data.detailInventoryCount.forEach(adjustmentDetail => {
      if (adjustmentDetail.tight == false) {

        var _Detail = new AdjustmentDetail();
        this.cont = this.cont + 1;
        _Detail.id = -1;
        _Detail.localid = this.cont;
        _Detail.idadjustment = this._IdAdjustment != 0 ? this._IdAdjustment : -1;
        _Detail.idproduct = adjustmentDetail.idProduct;
        _Detail.idpackage = adjustmentDetail.idPacket;
        _Detail.product = adjustmentDetail.product;
        _Detail.bar = adjustmentDetail.gtin;
        _Detail.idmotive = -1;
        _Detail.motive = "por editar";
        _Detail.unitsperpackaging = adjustmentDetail.unitPerPackaging;
        _Detail.totalunits = adjustmentDetail.totalunits;
        _Detail.idarea = adjustmentDetail.idArea;
        _Detail.idspace = adjustmentDetail.idSpace;
        _Detail.idprovider = this._dataAdjustment.idresponsableuser;
        _Detail.actualexistence = adjustmentDetail.existences;
        _Detail.iddetailphysicalcount = adjustmentDetail.id;
        _Detail.idprovider = 1;
        var countdetail = adjustmentDetail.details.find(x => x.indDefinitive == true);
        _Detail.quantity = countdetail !== undefined ? countdetail.count : 0;
        if (_Detail.actualexistence < 0) {
          _Detail.entries = _Detail.quantity + (_Detail.actualexistence * -1);
          _Detail.outputs = 0;
        } else if (_Detail.actualexistence > _Detail.quantity) {
          _Detail.entries = 0;
          _Detail.outputs = _Detail.actualexistence - _Detail.quantity;
        } else {
          _Detail.outputs = 0;
          _Detail.entries = _Detail.quantity - _Detail.actualexistence
        }

        _Detail.totalunits = (_Detail.entries != 0 ? _Detail.entries : _Detail.outputs) * _Detail.unitsperpackaging;
        this._DetailProductListTemp.push(_Detail);
      }

    });

  }



  ChangeStatusAdjustment(adjustment: Adjustment, idStatus: number) {
    this.submitted = true;
    if (this._dataAdjustment.idadjustmenttype > 0 &&
        this._dataAdjustment.idarea > 0 &&
        this._dataAdjustment.idresponsableuser > -1 ) {

        if(idStatus == this.statusesIDs.FINALIZED_STATUS_ID)
        {
          this.confirmationService.confirm({
            message: '¿Está seguro que desea finalizar el ajuste de inventario?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              debugger
              if(this._DetailProductListTemp.length > 0 ){
                var ValidMotive = this._DetailProductListTemp.filter(x => x.idmotive == -1 || x.idmotive == 0)
                if (ValidMotive.length <= 0)
                {
                  this._dataAdjustment.idEstatus = idStatus;
                  this._dataAdjustment.numberitems=this._DetailProductListTemp== undefined? 0:this._DetailProductListTemp.length;
                  this._adjustmentService.ChangeInventoryAdjustmentStatus(this._dataAdjustment).subscribe((data) => {
                    this._dataAdjustment = data[0];
                    this._DetailProductListTemp = data[0].adjustemntdetailList;
                    this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Ajuste finalizado con éxito." });
                    this.isFormEdit=false;
                  }, () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
                  });
                }else
                {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Antes de finalizar debe asignar motivos a los productos" });
                }
               }else
               {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "No puede finalizar el ajuste ya que no tiene detalles agregados." });
               }
            },
            reject: (type) => {
              switch (type) {
                case ConfirmEventType.REJECT:
                  return false;
                case ConfirmEventType.CANCEL:
                  return false;
              }
            }
          });  
          
          
         
        }else if(idStatus == this.statusesIDs.CANCELED_STATUS_ID)
        {
          this.confirmationService.confirm({
            message: '¿Está seguro que desea anular el ajuste de inventario?. No se podrá revertir esta acción y se hará un reverso del ajuste.',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this._dataAdjustment.idEstatus = idStatus;
              this._adjustmentService.ChangeInventoryAdjustmentStatus(this._dataAdjustment).subscribe((data) => {
               debugger;
                console.log(data[0]);
                this._dataAdjustment = data[0];
                this._DetailProductListTemp = data[0].adjustemntdetailList;
                let link: any[] = ['/general-adjustment-panel', data[0].id.toString()];
                this.location.go(link[0] + "/" + link[1]);
                this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Ajuste anulado con éxito." });
              }, () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
              });
            },
            reject: (type) => {
              switch (type) {
                case ConfirmEventType.REJECT:
                  return false;
                case ConfirmEventType.CANCEL:
                  return false;
              }
            }
          });
        }

    }else
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existen campos sin completar para cambiar el estatus." });
    }
  }

  onchangeCategory(event: any) {
    this.isFormEdit ==true;
    if (this._DetailProductListTemp.length > 0) {
      if (this._dataAdjustment.idcategory != 0 && this.previousVal == 0) {
        this.previousVal = this._dataAdjustment.idcategory;
        this.CategoriesList = this.CategoriesList.filter(x => x.value == this._dataAdjustment.idcategory || x.value == -1);
      }
      else {
        this.CategoriesList = this.CategoriesList.filter(x => x.value == this._dataAdjustment.idcategory || x.value == this.previousVal);
      }
      this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: "No puede cambiar la categoría mientras existan productos listados en el ajuste." });
    }
    else {
      this.onLoadCategorys();
    }
  }

  onchangeArea(event: any) {
    this.isFormEdit=true;
    if (this._DetailProductListTemp.length > 0) {
      if (this._dataAdjustment.idarea != 0 && this.previousValArea == 0) {
        this.previousValArea = this._dataAdjustment.idarea;
        this.AreaList = this.AreaList.filter(x => x.value == this._dataAdjustment.idarea || x.value == -1);
      }
      else {
        this.AreaList = this.AreaList.filter(x => x.value == this._dataAdjustment.idarea || x.value == this.previousValArea);
      }
      this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: "No puede cambiar el area  mientras existan productos listados en el ajuste." });
    }
    else {
      this.onLoadArea();
    }
  }

  onchangeAdjustmentType(event: any) {
    if (this._DetailProductListTemp.length > 0) {
      if (this._dataAdjustment.idadjustmenttype != 0 && this.previousValType == 0) {
        this.previousValType = this._dataAdjustment.idadjustmenttype;
        this.AdjustmentTypeList = this.AdjustmentTypeList.filter(x => x.value == this._dataAdjustment.idadjustmenttype || x.value == -1);
      }
      else {
        this.AdjustmentTypeList = this.AdjustmentTypeList.filter(x => x.value == this._dataAdjustment.idadjustmenttype || x.value == this.previousValType);
      }
      this.messageService.add({ severity: 'warn', summary: 'Adventencia', detail: "No puede cambiar El tipo de ajuste mientras existan productos listados en el ajuste" });
    }
    else {
      this.onLoadAdjustmentType();
    }

  }



}
