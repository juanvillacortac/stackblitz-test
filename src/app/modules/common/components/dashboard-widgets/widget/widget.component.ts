import { Component, Input, OnInit } from '@angular/core';
import { widgetType } from 'src/app/models/common/widget-type';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalCategoryComponent } from 'src/app/modules/srm/dashboard/dashboard-modal/modal-category/modal-category.component';
@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  providers: [DialogService]
})
export class WidgetComponent implements OnInit {
  public type = widgetType;
  @Input() 'data': any;
  @Input() 'title': any;
  @Input() 'nroModal': any;
  @Input() 'plusVisible': 0;
  @Input() 'mayor': 0;
  @Input() 'menor': 0;
 
 

  constructor() { }
 
   
  ngOnInit(): void {

  }

}
