import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'complementary-info-main',
  templateUrl: './complementary-info-main.component.html',
  styleUrls: ['./complementary-info-main.component.scss']
})
export class ComplementaryInfoMainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.generateYears();
  }

  actualYear : number = new Date().getFullYear();
  years: number[] = [];
  i: number = 0;

  generateYears(){
    for (let index = this.actualYear-40; index <= this.actualYear; this.i++) {
      this.years.push(index++);
    }
    return this.years;
  }

}
