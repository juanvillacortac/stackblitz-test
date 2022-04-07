import { BaseWidget } from './base-widget';
import { Label } from './label';
import { MultiValue } from './multi-value';

export class WidgetData extends BaseWidget {
    totalValue: number;
    currentValue: number;
    goal: number;
    percentage: number;
    comparator: string;
    urlField: string;
    idField: string;
    details: BaseWidget[];
    labels: Label[];
    values: BaseWidget[];
    multiValues: MultiValue;
}
