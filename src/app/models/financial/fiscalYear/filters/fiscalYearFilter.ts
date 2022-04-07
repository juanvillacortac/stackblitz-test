export interface FiscalYearFilterList {
	id?: number
	year?: string
	initDate?: string
	endDate?: string
	openedModulesId?: number[]
	closedModulesId?: number[]
	active?: number
}

export const FISCAL_YEAR_FILTER_LIST_DEFAULT: FiscalYearFilterList = {
	id: -1,
	initDate: '1900.01.01',
	endDate: '1900.01.01',
	active: -1,
}
