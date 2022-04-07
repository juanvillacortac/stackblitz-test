import { Component, Input, OnInit } from '@angular/core';
import { DataviewModel } from 'src/app/models/common/dataview-model';

@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.scss']
})
export class ListTeamComponent implements OnInit {
  @Input("paginator") paginator: boolean = false;  
  @Input("dataViewModel") dataViewModel: DataviewModel;
  @Input("titleGeneral") titleGeneral: string;
  ButtomImage: string;
  constructor() { }
  linkview:boolean;
  ngOnInit(): void {
    this.linkview=this.dataViewModel.linkTitleIn;
  }
  imgClick(nromodalimg:number,item:DataviewModel){
    
  
    }
  
    nameLink(nromodal:number,item:DataviewModel){
  
      switch (nromodal) {
        case 1:
         
          break; 
         
      
        default:
          break;
      }
  
    
    }
    
}
