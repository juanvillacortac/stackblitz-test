import { MeasurementUnits } from "src/app/modules/masters-mpc/shared/view-models/measurement-units.viewmodel";
import { Packingtype } from "../masters-mpc/common/packingtype";
import { Gtintype } from "../masters-mpc/gtintype";
import { Packagingpresentation } from "../masters-mpc/packagingpresentation";
import { Useofpackaging } from "../masters-mpc/useofpackaging";
import { Product } from "./product";

export class Packing {
  id: number = -1;
  product: Product = new Product();
  packingType: Packingtype = new Packingtype();
  packagingPresentation: Packagingpresentation = new Packagingpresentation();
  useofPackaging: Useofpackaging = new Useofpackaging();
  gtinType: Gtintype = new Gtintype();
  measurementUnit: MeasurementUnits = new MeasurementUnits();
  units: number = 0;
  barcode: string = "";
  maxLitters: number = 0;
  packingsByLitters: number = 0;
  high: number = 0;
  width: number = 0;
  length: number = 0;
  volume: number = 0;
  weight: number = 0;
  grossWeight: number = 0;
  active: boolean = true;
  createdByUser: string = "";
  createdByUserId: number = -1;
  updatedByUser: string = "";
  updatedByUserId: number = -1;
  dateCreate: Date = new Date();
  dateUpdate: Date = new Date();
  dimensions: string = "";
  groupingGenerationBarId: number = -1;
  typeGenerationBarId: number = -1;
}
