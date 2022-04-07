import { Dto } from "src/app/modules/shared/utils/dto"
import { FiscalPeriod } from "./FiscalPeriod"

const toDate = (str: string) => {
	const d = new Date(str)
	const padLeft = (n: number) => ("00" + n).slice(-2)
	const dformat = [
		padLeft(d.getDate()),
		padLeft(d.getMonth() + 1),
		d.getFullYear()
	].join('/');
	return dformat
}

export class FiscalYear {
	id: number
	year: string
	periodLength: number
	@Dto(toDate)
	initDate: string
	@Dto(toDate)
	endDate: string
	unitPeriodTypeId: number
	unitPeriodType: string
	fiscalPeriods: FiscalPeriod[]
	active: boolean
	createdByUserId: number
	updateddByUserId: number
	createdByUser: string
	updateddByUser: string
}
