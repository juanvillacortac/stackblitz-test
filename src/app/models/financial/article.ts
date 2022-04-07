import { TaxPlanDetail } from "../masters/tax-plan";
import { AssociatedAccounts } from "./AssociatedAccounts"
import { ItemCost } from "./ItemCost";

export class ArticlePage {
    registers: number
    articles: Article[]
}

export class Article {
    articleId: number=-1
    empresaId:number=-1
    empresa:string=""
    descripcionArticulo:string=""
    claseArticuloId:number=-1
    claseArticulo:string=""
    tipoArticuloId:number=-1
    tipoArticulo:string=""
    centroCostoId:number=-1
    centroCosto:string=""
    estatuArticuloId:number=-1
    estatuArticulo:string=""
    articleName:string=""
    active:boolean=true
    numeroPagina:number=-1
    registrosPagina:number=-1
    planImpuestoIdArt:number=-1
    articuloImpuestoId:number=-1
    costList:ItemCost[]=[];
    cost:ItemCost[]=[];
    monedaIdArt :number=-1
    costoArt :number=0
    moduloArti:string=""
    moduloOrigenId:number=1
    planImpuestoArt:string=""
    associatedAccount:AssociatedAccounts[]=[];
    taxes: ArticleTax[]=[];
    
    createdByUserId :number =-1
   
    createdByUser :string ="";
   
    updatedByUserId :number =-1
     
    updateByUser :string ="";
   
    createdDate :string ="";
     
    updatedDate :string ="";

   }

export type ArticleTax = {
    articuloImpuestoId?: number,
    tasaImpuestoId?: number,
    activeImpuesto?: boolean,
    tasaImpuesto?: string,
    impuestoIdArt?: number,
    abreviatura?: string,
    rate?: number,
    origenImpuesto?: string,
}

export class ArticleTypeFilter {
    id: number = -1
    name: string
    businessId: number = -1
    active: number = -1
}

export class ArticleType {
    id: number
    typeOfArticleName: string
    businessId: number
    nameBusiness: string
    active: boolean
}
