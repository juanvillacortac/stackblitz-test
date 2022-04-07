import { MultimediaUse } from "src/app/modules/masters-mpc/shared/view-models/multimedia-use.viewmodel";

export class Multimedia{
    id: number = -1;
    name: string = ""
    link: string = ""
    principal: boolean = false
    multimediauses: MultimediaUse[] = new Array<MultimediaUse>()
}