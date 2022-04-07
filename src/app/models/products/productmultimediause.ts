import { MultimediaUse } from "src/app/modules/masters-mpc/shared/view-models/multimedia-use.viewmodel";

export class ProductMultimediaUse {
  id: number = -1;
  multimediaId: number = -1;
  multimediaUse: MultimediaUse = new MultimediaUse();
  active: boolean = true;
  createdByUser: string = "";
  createdByUserId: number = -1;
  updatedByUser: string = "";
  updatedByUserId: number = -1;
  dateCreate: Date = new Date();
  dateUpdate: Date = new Date();
}
