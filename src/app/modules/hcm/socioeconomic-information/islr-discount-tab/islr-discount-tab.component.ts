import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISLRDiscount } from '../../shared/models/laborRelationship/islr-discount';
import { ISLRDiscountService } from '../../shared/services/islr-discount.service';
import { ISLRDiscountFilter } from '../../shared/filters/islr-discount-filter';
import {  } from '../../shared/models/laborRelationship/islr-discount';

@Component({
  selector: 'app-islr-discount-tab',
  templateUrl: './islr-discount-tab.component.html',
  styleUrls: ['./islr-discount-tab.component.scss']
})
export class IslrDiscountTabComponent implements OnInit {


  idLaborRelationship: number;
  islrDiscountFilter: ISLRDiscountFilter = new ISLRDiscountFilter();
  islrDiscountList: ISLRDiscount[] = [];


  constructor(private activatedRoute: ActivatedRoute, private islrDiscountService: ISLRDiscountService) { 

    this.idLaborRelationship = this.activatedRoute.snapshot.params['rel'];
  }

  ngOnInit(): void {
    this.onLoadISLRDiscount();
  }

  onLoadISLRDiscount(){
    this.islrDiscountService.getISLRDiscountList(this.islrDiscountFilter).subscribe((list) => {
      this.islrDiscountList = list;
    });
  }
}
