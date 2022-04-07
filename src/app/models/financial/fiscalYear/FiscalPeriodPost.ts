import { FiscalPeriodModule } from "./fiscalPeriodModule"
import { Dto } from "src/app/modules/shared/utils/dto"
import { toDate } from "./FiscalYearPost"

export class FiscalPeriodPost {
	id: number
	name: string
	periodNumber: number

	@Dto(toDate)
	initDate: string | Date

	@Dto(toDate)
	endDate: string | Date

	indClosed: string
	modules: FiscalPeriodModule[]
	active: boolean
}
