import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { TransportClassification } from 'src/app/models/srm/common/transport-classification';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersTransport } from 'src/app/models/tms/merchandisebranchtransferstransport';
import { Vehicle } from 'src/app/models/tms/vehicle';
import { DriverFilter } from 'src/app/modules/tms/master-driver/shared/filter/driver-filter';
import { DriverService } from 'src/app/modules/tms/master-driver/shared/service/driver.service';
import { VehicleFilter } from 'src/app/modules/tms/master-vehicle/shared/filter/vehicle-filter';
import { VehicleService } from 'src/app/modules/tms/master-vehicle/shared/service/vehicle.service';

@Component({
  selector: 'app-search-vehicles',
  templateUrl: './search-vehicles.component.html',
  styleUrls: ['./search-vehicles.component.scss']
})
export class SearchVehiclesComponent implements OnInit {

  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialog")  showDialog: boolean = false;
  @Input("merchandiseBranchTransfer")  merchandiseBranchTransfer: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  @Input("merchandiseBranchTransferDB")  merchandiseBranchTransferDB: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("merchandiseBranchTransferChange") merchandiseBranchTransferChange = new EventEmitter();
  @Output() addvehicleslist = new EventEmitter();
  filters: VehicleFilter = new VehicleFilter();;
  statusList: SelectItem[] = [];
  selectedVehicle:Vehicle;
  vehiclesList: Vehicle[] = [];
  vehicleTypeList: SelectItem[] = [];
  driversList: SelectItem[] =[];

  displayedColumns: ColumnD<Vehicle>[] =
  [
    { template: (data) => { return data.id; }, header: 'idProductBranchOfficePacking', display: 'none',field:'id' },
    { template: (data) => { return data.vehicleCode; }, header: 'Código del vehículo', display: 'table-cell',field:'vehicleCode' },
    { template: (data) => { return data.vehicleType; }, header: 'Uso del vehículo', display: 'table-cell',field: 'vehicleType' }, 
    { template: (data) => { return data.vehicleRegistrationPlate; }, header: 'Placa', display: 'table-cell',field: 'vehicleRegistrationPlate' }, 
    { template: (data) => { return data.vehicleDriver; }, header: 'Conductor principal', display: 'table-cell',field: 'vehicleDriver' }, 
  ];

  constructor(private vehicleService: VehicleService,
    private driverService: DriverService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.searchVehiclesType();
    this.searchDrivers();
  }

  onShow(){
    //this.selectedVehicles = [];
  }

  onHide(){
    this.vehiclesList = [];
    this.clearFilters()
    this. showDialog = false;
    this.showDialogChange.emit(this. showDialog);
  }

  search()
  {
    this.filters.principalDriverID = this.filters.principalDriverID == null ? -1 : this.filters.principalDriverID;
    this.filters.vehicleTypeID = this.filters.vehicleTypeID == null ? -1 : this.filters.vehicleTypeID;
    this.vehicleService.getVehiclesList(this.filters).subscribe((data: Vehicle[]) => {
      this.vehiclesList = data;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  addVehicles()
  { 
    if (this.selectedVehicle != null) {
      var vehicleExist: boolean = false;
      if (this.merchandiseBranchTransferDB.additionalData != null) {
        if (this.merchandiseBranchTransferDB.additionalData.filter(x => x.vehicle.id == this.selectedVehicle.id).length > 0) {
          vehicleExist = true;
        }
      }
      if (vehicleExist) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existen vehículos seleccionados que ya se encuentran registrados." });
      }else{
        var transpor = new MerchandiseBranchTransfersTransport();
        transpor.idBranchTransfer = this.merchandiseBranchTransfer.idBranchTransfer;
        transpor.vehicle = new Vehicle();
        transpor.vehicle = this.selectedVehicle;
        if (this.merchandiseBranchTransfer.additionalData == null) {
          this.merchandiseBranchTransfer.additionalData = [];
        }
        this.merchandiseBranchTransfer.additionalData.push(transpor);
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this.merchandiseBranchTransferChange.emit(this.merchandiseBranchTransfer)
        this.addvehicleslist.emit(); 
      }
     
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Seleccione al menos un vehículo." });
    }
    
  }

  clearFilters(){
    this.filters.vehicleCode="";
    this.filters.vehicleTypeID=-1;
    this.filters.vehicleRegistrationPlate="";
    this.filters.principalDriverID=-1;
  }

  searchVehiclesType(){
    this.vehicleService.getVehicleTypeList()
    .subscribe((data)=>{
      this.vehicleTypeList = data.map<SelectItem>((item)=>({
        label: item.vehicleType,
        value: item.vehicleTypeID
      }));
    },(error)=>{
      console.log(error);
    });
  }

  searchDrivers(){
    var _driverfilter: DriverFilter = new DriverFilter();
    _driverfilter.idTypeDriver = 1;
    this.driverService.getDriversList(_driverfilter)
    .subscribe((data)=>{
      data.sort((a, b) => a.userDriver.localeCompare(b.userDriver));
      this.driversList = data.map<SelectItem>((item)=>({
        label: item.userDriver,
        value: item.id
      }));
    }); 
  }
}
