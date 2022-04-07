import { Dto } from "src/app/modules/shared/utils/dto"
import { FiscalPeriodPost } from "./FiscalPeriodPost"

export const toDate = (str: string | Date) => {
	console.log(str)
	if (!str) {
		return undefined
	}
	const d = new Date(str)
	const padLeft = (n: number) => ("00" + n).slice(-2)
	const dformat = [
		d.getFullYear(),
		padLeft(d.getMonth() + 1),
		padLeft(d.getDate()),
	].join('-');
	return dformat
}

export class FiscalYearPost {
	id: number
	year: string
	@Dto()
	periodLength: number

	@Dto(toDate)
	initDate: string | Date

	@Dto(toDate)
	endDate: string | Date
	unitPeriodTypeId: number
	fiscalPeriods: FiscalPeriodPost[]
	active: boolean
}
