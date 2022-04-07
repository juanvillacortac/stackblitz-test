export class ColumnD<T> {
  field?: string = "";
  header?: string;
  display?: string;
  textAlign?: string = "left";
  style?: string;
  class?: string;

  template?(e: T): any {
    return null;
  }

  headerTemplate?(): any;
}
