export class ArticleClassificationFilter {
   
    id :number=-1
    articleClassificationName:string=""
    active?:number = -1
    businessId :number = 1
}

export const ARTICLE_CLASSIFICATION_ALL_ACTIVES_FILTER: ArticleClassificationFilter = {
    id: -1,
    active  : 1,
    articleClassificationName:"",
    businessId :1

}