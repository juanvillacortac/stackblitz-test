import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { max } from 'date-fns';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { FiscalPeriod } from 'src/app/models/financial/fiscalYear/FiscalPeriod';
import { FiscalPeriodModule } from 'src/app/models/financial/fiscalYear/fiscalPeriodModule';
import { FiscalPeriodPost } from 'src/app/models/financial/fiscalYear/FiscalPeriodPost';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { FiscalYearPost, toDate } from 'src/app/models/financial/fiscalYear/FiscalYearPost';
import { toDto } from 'src/app/modules/shared/utils/dto';
import { FiscalYearService } from '../shared/services/fiscal-year.service';

/** Por representación, el indClosed de cada módulo debe estar establecido a la inversa de su valor real */
@Component({
  selector: 'app-fiscal-year-mutation-modal',
  templateUrl: './fiscal-year-mutation-modal.component.html',
  styleUrls: ['./fiscal-year-mutation-modal.component.scss']
})
export class FiscalYearMutationModalComponent implements OnInit {
  @Input() displayModal: boolean;
  @Input() yearList: FiscalYear[];
  @Output() displayModalChange = new EventEmitter<boolean>();
  year: FiscalYear = { ...new FiscalYear(), id: -1 }
  periodsQuantity: number
  calculated = false

  oldData: FiscalYear

  periods: FiscalPeriodPost[];

  @Input() modules: FiscalPeriodModule[];
  initDate: Date
  endDate: Date
  openedModules: number[]
  closedModules: number[];

  @Output() onSave = new EventEmitter();

  unidad: number = null
  status = 2
  statusOptions: SelectItem[] = [
    { label: 'Activo', value: 2 },
    { label: 'Inactivo', value: 1 }
  ];
  unidades: SelectItem[] = [
    { label: 'Por defecto', value: 1 },
    { label: 'Semanas', value: 2 },
    { label: 'Meses', value: 3 }
  ];

  private toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat
  }

  minInitDate: Date
  maxEndDate: Date
  disabledDates: Date[] = []

  getOrderedYears = () => (this.yearList || []).sort((a, b) => +new Date(b.endDate) - +new Date(a.endDate))
  getLastYear = () => this.getOrderedYears().find(x => x !== undefined)
  getDisabledDates = (start: Date | string, end: Date | string) => {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt))
    }
    return arr
  }

  setDisabledDates() {
    const years = this.getOrderedYears().filter(y => y.id != this.year.id)
    let disabledDates = []
    years.forEach(y => {
      disabledDates = [...disabledDates, ...this.getDisabledDates(y.initDate, y.endDate)]
    })
    this.disabledDates = disabledDates
    console.log(this.disabledDates)
  }

  getMinInitDate = () => {
    const lastYear = this.getLastYear()
    if (!lastYear) {
      return null
    }
    const lastDate = new Date(lastYear.endDate)
    lastDate.setDate(lastDate.getDate() + 1)
    this.minInitDate = lastDate
  }

  getMaxEndDate = () => {
    if (this.year.id == -1) {
      if (this.initDate) {
        const year = this.getOrderedYears().reverse().find(y => +new Date(y.initDate) > +new Date(this.initDate))
        if (year) {
          const maxEndDate = new Date(year.initDate)
          maxEndDate.setDate(maxEndDate.getDate() - 1)
          this.maxEndDate = maxEndDate
        } else {
          this.maxEndDate = null
        }
      } else {
        this.maxEndDate = null
      }
      return
    }
    const nextYear = this.getOrderedYears().reverse().find(y => +new Date(y.initDate) > +new Date(this.oldData.endDate))
    console.log('Year: ', nextYear)
    if (!nextYear) {
      this.maxEndDate = null
      return
    }
    const nextDate = new Date(nextYear.initDate)
    nextDate.setDate(nextDate.getDate() - 1)
    console.log('Next: ', nextDate)
    this.maxEndDate = nextDate
  }

  maxInitDate: Date

  getMaxInitDate() {
    if (!this.endDate) return;
    const date = new Date(this.endDate)
    if (this.periodsQuantity > 1) {
      this.maxInitDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (this.periodsQuantity - 1))
    } else {
      this.maxInitDate = date
    }
  }

  displayedColumns: ColumnD<FiscalPeriodPost>[] = [
    { template: (data) => { return data.periodNumber; }, field: 'periodNumber', header: 'Período N°', display: 'table-cell' },
    { template: (data) => { return null; }, field: 'name', header: 'Nombre', display: 'table-cell' },
    { template: (data) => `${this.toDate(data.initDate)} - ${this.toDate(data.endDate)}`, field: 'period', header: 'Período', display: 'table-cell' },
  ]

  log = console.log

  constructor(private service: FiscalYearService, private messageService: MessageService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    if (this.year.id == -1) {
      this.getMinInitDate()
    }
  }

  private mergeModules(modules: FiscalPeriodModule[]) {
    return modules.map(m => {
      return {
        ...m,
        indClosed: !!+m.indClosed
      }
    })
  }

  getModuleIdx(modules: FiscalPeriodModule[], id: number) {
    return modules.findIndex(m => m.id == id)
  }

  initFromData(year: FiscalYear) {
    this.year.id = year.id
    this.year.year = year.year
    this.initDate = new Date(year.initDate)
    this.endDate = new Date(year.endDate)
    this.periodsQuantity = year.periodLength
    this.unidad = +year.unitPeriodTypeId
    this.periods = [...year.fiscalPeriods.filter(p => p.active).map<FiscalPeriodPost>(p => ({
      ...p,
      modules: [...this.mergeModules([...p.closedModules, ...p.openedModules])]
    }))]
    this.status = +year.active + 1
    this.calculated = false
    this.minInitDate = new Date(year.initDate)
    this.getMaxEndDate()
    this.getMaxInitDate()
    this.getMinDate(this.initDate)
  }

  openNew() {
    this.isSaving = false
    this.displayModal = true;
    this.displayModalChange.emit(this.displayModal);
    this.minInitDate = null
    this.getMinInitDate()
    this.setDisabledDates()
    this.getMaxInitDate()
  }

  edit(year: FiscalYear) {
    this.oldData = year
    this.initFromData(year)
    this.setDisabledDates()
    this.calculated = true
  }

  lock() {
    this.calculated = false
  }

  minEndDate: Date

  onUnitChange(e) {
    if (e.value) {
      this.periodsQuantity = Math.max(1, Math.min(e.value, 48))
    }
    if (this.unidad === 1) {
      this.endDate = null;
      this.maxInitDate = null
      this.maxEndDate = null
      this.minEndDate = null
    }
    this.getMinDate(this.initDate)
    this.getMaxEndDate()
  }

  getMinDate(date: Date) {
    console.log(this.periodsQuantity)
    if (!date) return;
    if (this.periodsQuantity > 1) {
      this.minEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + this.periodsQuantity - 1)
    } else {
      this.minEndDate = date
    }
  }

  calculate() {
    let daysPerPeriod: number
    if (!this.initDate || this.unidad == null || this.periodsQuantity == null) {
      this.messageService.clear()
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Debe seleccionar la fecha de inicio del ejercicio, la unidad del los períodos y especificar la cantidad deseada de períodos.",
        life: 3000,
      })
      return
    }
    const initDate = new Date(this.initDate.getFullYear(), this.initDate.getMonth(), this.initDate.getDate())
    switch (this.unidad) {
      case 1:
        if (!this.endDate) {
          this.messageService.clear()
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Debe seleccionar seleccionar la fecha fin del ejercicio.",
            closable: false,
            life: 3000,
          })
          return
        }
        const _MS_PER_DAY = 1000 * 60 * 60 * 24

        const utc1 = Date.UTC(this.initDate.getFullYear(), this.initDate.getMonth(), this.initDate.getDate())
        const utc2 = Date.UTC(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate())

        const diffInDays = Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY))

        daysPerPeriod = Math.round(diffInDays / +this.periodsQuantity) - 1
        break
      case 2:
        daysPerPeriod = 6
        break
      case 3:
        daysPerPeriod = 30
        break
    }
    const endDate = new Date(this.endDate)
    let lastDay = initDate
    let periods: FiscalPeriodPost[] = []
    if (this.periodsQuantity == 1 && this.unidad == 1) {
      periods = [{
        id: -1,
        name: `Período 1`,
        periodNumber: 1,
        indClosed: '',
        initDate: initDate,
        endDate: endDate,
        modules: this.modules.map<FiscalPeriodModule>((s) => ({
          id: s.id,
          indClosed: true,
          name: s.name,
        })),
        active: true,
      }]
    } else {
      for (const i of Array.from({ length: this.periodsQuantity }).keys()) {
        const newEnd = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + daysPerPeriod)
        periods = [
          ...periods || [],
          {
            id: -1,
            name: `Período ${i + 1}`,
            periodNumber: i + 1,
            indClosed: '',
            initDate: lastDay,
            endDate: newEnd,
            modules: this.modules.map<FiscalPeriodModule>((s) => ({
              id: s.id,
              indClosed: true,
              name: s.name,
            })),
            active: true,
          }
        ]
        lastDay = new Date(newEnd.getFullYear(), newEnd.getMonth(), newEnd.getDate() + 1)
      }
      const yearEndDate = new Date(periods[periods.length - 1].endDate)
      let nextDisabledDate: Date
      let nextDisabledYear: FiscalYear
      if (this.disabledDates.some(d => {
        const invalid = +new Date(this.initDate) <= +new Date(d) && +new Date(yearEndDate) >= +new Date(d)
        if (invalid) {
          nextDisabledYear = this.yearList.find(y => +new Date(y.initDate) == +new Date(d))
        };
        return invalid
      })) {
        this.messageService.clear()
        this.messageService.add({
          severity: 'error',
          summary: 'Intersección en los ejercicios',
          // detail: `Las fecha de los períodos generados a partir de la unidad seleccionada, interfieren con un ejercicio fiscal existente (${this.toDate(nextDisabledDate)} - ${this.toDate(yearEndDate)})`,
          detail: `Las fecha de los períodos generados a partir de la unidad seleccionada, interfieren con el ejercicio fiscal existente "${nextDisabledYear.year}" (${this.toDate(nextDisabledYear.initDate)} - ${this.toDate(nextDisabledYear.endDate)})`,
          life: 5000,
        })
        return
      }
      if (+endDate.getTime() !== +(yearEndDate)) {
        if (this.unidad == 1) {
          this.messageService.clear()
          this.messageService.add({
            severity: 'info',
            summary: 'Advertencia',
            detail: "Se reajustó la fecha fin del último período para que concuerde con la fecha fin del ejercicio",
            life: 5000,
          })
          periods[periods.length - 1].endDate = new Date(endDate)
        } else {
          this.endDate = yearEndDate
        }
      }
    }
    this.periods = periods
    this.calculated = true
  }

  selectAll(ind: boolean) {
    const periods = this.periods
    periods?.forEach((p) => {
      p.modules.forEach((m) => {
        m.indClosed = +ind
      })
    })
    this.periods = periods
  }

  isInvalid() {
    const duplicatedYear = this.getOrderedYears()
      .filter(y => this.year.id != y.id)
      .map(y => y.year)
      .concat(this.year.year)
      .some((y, idx, arr) => arr.indexOf(y, idx + 1) !== -1)

    const duplicatedPeriods = this.periods
      .map(p => p.name)
      .some((p, idx, arr) => arr.indexOf(p, idx + 1) !== -1)

    const isSomeDuplicated = duplicatedYear || duplicatedPeriods

    const empty = this.periods.some(p => !!!p.name?.trim())

    if (isSomeDuplicated || empty) {
      this.messageService.clear()
    }

    if (duplicatedYear) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ejercicio duplicado',
        detail: "Ya se encuentra registrado un ejercicio fiscal con ese nombre",
        life: 5000,
      })
    }

    if (duplicatedPeriods) {
      this.messageService.add({
        severity: 'error',
        summary: 'Períodos duplicados',
        detail: "Asegúrese de que dos o más períodos no tengan el mismo nombre",
        life: 5000,
      })
    }

    if (empty) {
      this.messageService.add({
        severity: 'error',
        summary: 'Período sin nombre',
        detail: "Los nombres de los períodos no pueden estar vacíos",
        life: 5000,
      })
    }

    return isSomeDuplicated || empty
  }

  save() {
    if (this.isInvalid()) {
      return
    }
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro de guardar los cambios?',
      accept: () => {
        const postData = new FiscalYearPost()
        postData.year = this.year.year
        postData.id = this.year.id
        postData.initDate = this.initDate
        postData.endDate = this.endDate
        postData.periodLength = Number(this.periodsQuantity)
        postData.unitPeriodTypeId = this.unidad
        postData.active = !!+(this.status - 1)
        const model = {
          ...postData,
          initDate: toDate(this.initDate),
          endDate: toDate(this.endDate),
          fiscalPeriods: [
            ...this.periods.map(v => ({
              ...v,
              modules: v.modules.map((m) => ({
                ...m,
                indClosed: +m.indClosed,
              })),
              initDate: toDate(v.initDate),
              endDate: toDate(v.endDate),
            }))
          ],
        }
        this.service.post(model).subscribe(data => {
          if (data == -1) {
            this.messageService.add({
              severity: 'error',
              summary: 'Ejercicio duplicado',
              detail: "Ya se encuentra registrado un ejercicio fiscal con ese nombre",
              life: 5000,
            })
            return
          }
          if (data == 1029) {
            this.messageService.add({
              severity: 'error',
              summary: 'Intersección en los ejercicios',
              detail: `Las fecha de los períodos generados a partir de la unidad seleccionada, interfieren con un ejercicio fiscal existente`,
              life: 5000,
            })
            return
          }
          this.messageService.clear()
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: "Guardado exitoso",
            life: 5000,
          })
          this.onSave.emit()
          this.hideDialog(false)
        })
      }
    })
  }

  clear(force?: boolean) {
    if (force || this.year.id == -1) {
      this.unidad = null
      this.initDate = null
      this.endDate = null
      this.periods = null
      this.year = { ...new FiscalYear(), id: -1 }
      this.periodsQuantity = null
      this.calculated = false
      this.status = 2
      this.oldData = null
      this.minInitDate = null
      this.getMinInitDate()
      this.setDisabledDates()
      this.getMaxEndDate()
      this.getMaxInitDate()
      this.getMinDate(this.initDate)
    } else {
      this.initFromData(this.oldData)
      this.calculated = true
    }
  }

  checkEvent(mId: number, modules: FiscalPeriodModule[]) {
    const modulesClone = modules
    if (mId == 1 && modules[this.getModuleIdx(modules, mId)].indClosed) {
      modulesClone.forEach(m => {
        m.indClosed = true
      })
    }
    modules = modulesClone
  }

  isSaving = false

  hideDialog(modal = true) {
    this.displayModal = true;
    if (modal && !this.isSaving) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea cerrar el formulario? perderá los cambios realizados.',
        accept: () => {
          this.displayModal = false;
          this.displayModalChange.emit(this.displayModal);
          this.clear(true)
        },
        reject: () => {
          this.displayModal = true;
          this.displayModalChange.emit(this.displayModal);
        }
      })
    } else {
      this.isSaving = true
      this.displayModal = false;
      this.displayModalChange.emit(this.displayModal);
      this.clear(true)
    }
  }
}
