//General
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Models
import { ConceptsFilter } from '../../shared/filters/Concepts/concepts-filter';
import { Concept } from '../../shared/models/masters/concept';
//App Services
import { ConceptsService } from '../../shared/services/concepts/concepts-payroll-service';
import { MessageService } from 'primeng/api/';

@Component({
  selector: 'app-companies-concepts-card-info',
  templateUrl: './companies-concepts-card-info.component.html',
  styleUrls: ['./companies-concepts-card-info.component.scss']
})

export class CompaniesConceptsCardInfoComponent implements OnInit {
  
  @Input("conceptEdit") conceptEdit: Concept;
  constructor() { }

  ngOnInit(): void {
  }

}
