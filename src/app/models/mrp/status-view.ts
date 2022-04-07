import { EqualityResult } from '../mrp/equality-result.enum';

export interface StatusView {
    statusResult: EqualityResult;
    color: string;
    icon: String;
  }
