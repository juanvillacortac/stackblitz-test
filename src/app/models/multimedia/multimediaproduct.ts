import { ProductMultimediaUse } from "../products/productmultimediause";
import { MultimediaFormat } from "./common/multimediaformat";
import { MultimediaType } from "./common/multimediatype";

export class MultimediaProduct {
    id: number;
    productId: number;
    principal: boolean
    name: string;
    file: File;
    fileAsBase64: string = "";
    multimediaFormat: MultimediaFormat;
    weight: number;
    url: string;
    active: boolean;
    predetermined: boolean;
    productMultimediaUses: ProductMultimediaUse[]
    createdByUser: string;
    createdByUserId: number;
    updatedByUser: string;
    updatedByUserId: number;
    createdDate: Date;
    updatedDate: Date;
}