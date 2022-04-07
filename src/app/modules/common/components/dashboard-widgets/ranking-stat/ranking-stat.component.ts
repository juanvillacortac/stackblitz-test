import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking-stat',
  templateUrl: './ranking-stat.component.html',
  styleUrls: ['./ranking-stat.component.scss']
})
export class RankingStatComponent implements OnInit {
  @Input() position = 0;
  @Input() positionSummary = '';
  @Input() subPosition = -1;
  @Input() userName = '';
  @Input() userId = -1;
  @Input() img = '';
  fontSize = 15;
  width = 32;
  constructor() { }

  ngOnInit(): void {
    this.calculateWidth();
  }
  calculateWidth() {
    if (window.innerWidth >= 1981)  {
       this.fontSize = 27;
       this.width = 73;
    } else if ( window.innerWidth >= 1741 )  {
       this.fontSize = 21;
       this.width = 60;
    } else if ( window.innerWidth >= 1441)  {
      this.fontSize = 18;
      this.width = 45;
    } else if ( window.innerWidth >= 1241)  {
      this.fontSize = 15;
      this.width = 45;
    } else if ( window.innerWidth >= 999)  {
      this.fontSize = 11;
      this.width = 35;
    } else if ( window.innerWidth >= 740)  {
      this.fontSize = 22;
      this.width = 80;
    } else if ( window.innerWidth >= 500)  {
      this.fontSize = 20;
      this.width = 60;
    } else if ( window.innerWidth < 500)  {
      this.fontSize = 14;
      this.width = 40;
    }
   }
   @HostListener('window:resize', ['$event'])
    onResize(event) {
    this.calculateWidth();
  }
}
