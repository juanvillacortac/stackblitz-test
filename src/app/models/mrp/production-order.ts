import { BaseModel } from '../common/BaseModel';
import { OrderDetail } from './production-order-detail';

export interface ProductionOrder extends BaseModel {
    idRecipe: number;
    recipe: string;
    idProductionPlan: number;
    idRoom: number;
    quantity: number;
    producedQty: number;
    estimatedStartDate: Date;
    startDate: Date;
    deliveryDate: Date;
    endDate: Date;
    status: number;
    prepTime: number;
    details: OrderDetail[];
}
