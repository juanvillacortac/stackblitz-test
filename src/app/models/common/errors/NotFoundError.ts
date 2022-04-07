import { BaseError } from './BaseError';

export interface NotFoundError extends BaseError {
    Code: number;
    ErrorMsg: string;

}
