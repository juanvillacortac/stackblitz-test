import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-percend-ind-condition',
  templateUrl: './percend-ind-condition.component.html',
  styleUrls: ['./percend-ind-condition.component.scss']
})
export class PercendIndConditionComponent implements OnInit {
@Input() image = '';
@Input() currentValue = 0;
@Input() legend = '';
@Input() sublegend = '';
@Input() target = 0;//objetivo
@Input() valueVsTarget = 0;
@Input() url = '#';
@Input() mayor = 0;
@Input() menor = 0;
@Input() symbol = '%';
@Input() objectiveDescription = '';
constructor() { }


public Objetiveequal() {
 let resp:boolean=false;

if (this.target==this.currentValue)
resp=true;
else
 resp=false;

return resp;

}
Objetive3(){
  let resp:boolean=false;
  if (this.mayor==1){
    if (this.currentValue>this.target)
    resp=true;
  else
{
  resp=false;
}


}else{

if(this.menor==1){
if (this.currentValue<this.target)
resp=true;
else
{
resp=false;
}

}

}
return resp;

}
public Objetive2() {
  let resp:boolean=false;
  if (this.mayor==1)//evalua por encima del objetivo esta up, no d ebe aprecer aqui
  {
    if (this.currentValue>this.target)
        resp=false;
      else
  {
      resp=true;
  }
  
  }
  if (this.menor==1)//evalua por debajo del objetivo
  {
      if (this.currentValue<this.target)
      resp=false;
      else
      {
      resp=true;
  }
  
  }
  return resp;
 

}
ngOnInit(): void {

  if(this.objectiveDescription == ''){
    this.objectiveDescription = 'Objetivo:'
  }
}


}
