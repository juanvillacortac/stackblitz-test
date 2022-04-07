import { FiscalPeriodModule } from "./fiscalPeriodModule"

export class FiscalPeriod {
	id: number
	name: string
	periodNumber: number
	initDate: string
	endDate: string
	range: string
	indClosed: string
	openedModules: FiscalPeriodModule[]
	closedModules: FiscalPeriodModule[]
	active: boolean
	createdByUserId: number
	updateddByUserId: number
	createdByUser: string
	updateddByUser: string
}
