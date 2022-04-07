import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ArticleClassificationFilter } from 'src/app/models/financial/ArticleClassificationFilter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-article-classification-filters',
  templateUrl: './article-classification-filters.component.html',
  styleUrls: ['./article-classification-filters.component.scss']
})
export class ArticleClassificationFiltersComponent implements OnInit {

  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: ArticleClassificationFilter;
  @Output() onSearch = new EventEmitter<ArticleClassificationFilter>();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];
  id:number
  articleClassificationName:string
  active:number


  constructor() { }

  ngOnInit(): void {
   
    this.clearFilters();
  }

  search() {

        this.filters.id = this.id ? this.id : -1
        this.filters.articleClassificationName = this.articleClassificationName ? this.articleClassificationName.toString() :''    
        this.filters.active = this.active ? this.active === 2 ? 0 : 1 : -1;
        this.onSearch.emit(this.filters);
        
      }
    
      clearFilters() {
    
        this.id = null;
        this.articleClassificationName = null;
        this.active = null;
    
      }

}
