import { Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import 'chart.js';
import { ModalSalesComponent } from 'src/app/modules/srm/vieweroc-supplier/dashboard/modal-sales/modal-sales.component';

declare var Chart: any;

@Component({
    selector: 'app-p-chart-responsive',
    template: `
    <div style="position:relative" [style.width]="width" [style.height]="height">
        <canvas [attr.width]="width" [attr.height]="height" (click)="onCanvasClick($event)"></canvas>
        <div
            style="width: 130px; height: 130px; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; padding: 12% 0 0; line-height:25px; text-align: center; z-index: 998; color: #17a2b8; border-radius: 70%; font-size: 15px; font-weight: bold">
            {{value}}<Br />
            {{caption}}
        </div>
    </div>

    `
})
export class ResponsiveChartComponent implements AfterViewInit, OnDestroy {

    @Input() type: string;

    @Input() options: any = {};

    @Input() width: string;

    @Input() height: string;

    @Input() responsive = true;
    @Input() nroModal:any;

    @Input() value: '';
    @Input() caption: '';

    @Output() onDataSelect: EventEmitter<any> = new EventEmitter();

    initialized: boolean;

    _data: any;

    chart: any;

    constructor(public el: ElementRef,public dialogService: DialogService, public messageService: MessageService) {}
    ref: DynamicDialogRef;
    show() {
      switch (this.nroModal) {
        case 1:
          this.ref = this.dialogService.open(ModalSalesComponent, {
            header: 'Resumen de ventas por sucursal',
            width: '70%',
            contentStyle: {"max-height": "500px", "overflow": "auto"},
            baseZIndex: 10000
        });
          break;

        default:
          break;
      }

    /*   this.ref.onClose.subscribe((product: Product) =>{
          if (product) {
              this.messageService.add({severity:'info', summary: 'Product Selected', detail: product.name});
          }
      }); */
  }
    @Input() get data(): any {
        return this._data;
    }

    set data(val: any) {
        this._data = val;
        this.reinit();
    }

    ngAfterViewInit() {
        this.initChart();
        this.initialized = true;
    }

    onCanvasClick(event) {
        if (this.chart) {
            const element = this.chart.getElementAtEvent(event);
            const dataset = this.chart.getDatasetAtEvent(event);
            if (element && element[0] && dataset) {
                this.onDataSelect.emit({originalEvent: event, element: element[0], dataset: dataset});
            }
        }
    }

    initChart() {
        const opts = this.options || {};
        opts.responsive = this.responsive;

        this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
            type: this.type,
            data: this.data,
            options: this.options
        });
    }

    getCanvas() {
        return this.el.nativeElement.children[0].children[0];
    }

    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }

    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }
}
