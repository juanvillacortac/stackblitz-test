import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.scss']
})
export class RankingTableComponent implements OnInit {

  @Input() data: any[];
  @Input() maxRow = 10;
  @Input() valueTittle = '';
  dataPerPage: any[];
  constructor() { }

  ngOnInit(): void {
    this.dataPerPage = this.data
                           .sort((a, b) => a.position - b.position)
                           .slice(0, this.maxRow);
  }

  paginate(event) {
    this.dataPerPage = this.data
                           .sort((a, b) => a.position - b.position)
                           .slice(event.first, event.first + event.rows);
 }
}
