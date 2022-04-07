import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-generic-master-panel',
  templateUrl: './generic-master-panel.component.html',
  styleUrls: ['./generic-master-panel.component.scss']
})
export class GenericMasterPanelComponent implements OnInit {

  constructor() { }
  @Input("Modelin") Modelin: any;
  @Input("showDialog") showDialog: boolean = false;
  @Input("ModelPanel") ModelPanel: any[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  data: any; 

  ngOnInit(): void {
    if (this.Modelin===undefined) {
      this.Modelin = {}
    }
    console.log(this.Modelin);
    this.data = { value: "modelin.description" , type:'text' };
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

}
