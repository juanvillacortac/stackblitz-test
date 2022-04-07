import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { ColumnD } from "src/app/models/common/columnsd";
import {
  TaxPlan,
  TaxPlanApplicationType,
  TaxPlanRawTax,
  TaxPlanDetail,
  TaxPlanRate,
  TaxPlanFilter,
} from "src/app/models/masters/tax-plan";
import { TaxeTypeApplication } from "src/app/models/masters/taxe-type-application";
import { TaxPlanService } from "../shared/services/tax-plan.service";

type TaxesMap = Record<number, [boolean, number]>;

const deepCompare = (obj1: Object, obj2: Object) => {
  //Loop through properties in object 1
  for (var p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      //Deep compare objects
      case "object":
        if (!deepCompare(obj1[p], obj2[p])) return false;
        break;
      //Compare function code
      case "function":
        if (
          typeof obj2[p] == "undefined" ||
          (p != "compare" && obj1[p].toString() != obj2[p].toString())
        )
          return false;
        break;
      //Compare values
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  //Check object 2 for any extra properties
  for (var p in obj2) {
    if (typeof obj1[p] == "undefined") return false;
  }
  return true;
};

@Component({
  selector: "app-tax-plan-mutation-modal",
  templateUrl: "./tax-plan-mutation-modal.component.html",
  styleUrls: ["./tax-plan-mutation-modal.component.scss"],
})
export class TaxPlanMutationModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  plan = new TaxPlan();

  @Input() rawTaxes: TaxPlanRawTax[];
  @Input() types: TaxPlanApplicationType[];
  @Input() appTypes: TaxeTypeApplication[];

  @Output() needRefresh = new EventEmitter();

  @Output() onSave = new EventEmitter();

  filterAppIds: number[] = [];
  groupIdx: number;
  filteredCount: number;

  oldPlan: TaxPlan;

  loaded = false;

  filterTableEmitter() {
    this.filtered = false;
    this.needRefresh.emit();
  }

  expanded: Record<string | number, boolean> = {};
  checkedRates: Record<number, [number, number]> = {};

  crudRates(id: number) {
    let arr = [];
    for (let t of this.plan.taxes) {
      if (t.taxId == id && t.active) arr.push(t);
    }
    return arr;
  }

  addRate(taxId: number) {
    const rates = this.checkedRates[taxId];
    if (rates && rates[0]) {
      this.plan.taxes.push({
        ...new TaxPlanDetail(),
        id: -1,
        active: true,
        taxId: taxId,
        rateId: rates[0],
        baseRateId: rates[1],
      });
      this.checkedRates[taxId] = [-1, -1];
      this.filterRates(taxId);
    }
  }

  getRate(taxId: number, rateId: number) {
    return this.rateOptions[taxId].find((r) => +r.value == rateId);
  }

  getBaseRate(taxId: number, rateId: number) {
    return this.baseRateOptions[taxId].find((r) => +r.value == rateId);
  }

  ensure<T>(arr: T[]) {
    return arr.filter((obj) => obj);
  }

  resetLayout() {
    for (const key in this.expanded) {
      if (Object.prototype.hasOwnProperty.call(this.expanded, key)) {
        this.expanded[key] = false;
        this.checkedRates[key] = [-1, -1];
      }
    }
  }

  filterTable() {
    let filtered: TaxPlanRawTax[];
    if (this.filterAppIds?.length) {
      filtered = this.rawTaxes.filter((x) =>
        this.filterAppIds.some((y) => x.applicationTypeIds.some((z) => z == y))
      );
    } else {
      filtered = this.rawTaxes;
    }
    filtered = filtered.filter((t) => !this.checkedTaxes[t.id][0]);
    this.filteredRawTaxes = [
      ...this.rawTaxes.filter((t) => this.checkedTaxes[t.id][0]),
      ...filtered,
    ];
    this.filteredRawTaxes.forEach((t) => {
      this.rateOptions[t.id] = this.getRateOptions(t.rates);
      this.baseRateOptions[t.id] = this.getRateOptions(t.baseTaxRates);
      this.filterRates(t.id);
    });
    this.groupIdx = this.filteredRawTaxes.findIndex(
      (t) => !this.checkedTaxes[t.id][0]
    );
    this.filteredCount = filtered.length;
  }

  status = 2;
  statusOptions: SelectItem[] = [
    { label: "Activo", value: 2 },
    { label: "Inactivo", value: 1 },
  ];

  filteredRawTaxes: TaxPlanRawTax[] = [];

  checkedTaxes: TaxesMap = {};
  oldCheckedTaxes: TaxesMap = {};

  displayedColumns: ColumnD<TaxPlanRawTax>[] = [
    {
      template: (d) => null,
      field: "active",
      header: "Seleccionados",
      display: "table-cell",
    },
    {
      template: (d) => `${d.name} (${d.abbreviation})`,
      field: "name",
      header: "Impuesto",
      display: "table-cell",
    },
    {
      template: (d) => null,
      field: "rate",
      header: "Tasas",
      display: "table-cell",
    },
    // { template: d => null, field: 'rates', header: 'Tasa', display: 'table-cell' },
  ];

  rateCols: ColumnD<any>[] = [
    {
      template: (d) => null,
      field: "rate",
      header: "Tasa",
      display: "table-cell",
    },
    {
      template: (d) => null,
      field: "retention",
      header: "Tasa retención",
      display: "table-cell",
    },
  ];

  log = console.log;

  constructor(
    private service: TaxPlanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.displayModalChange.emit(this.displayModal);
  }

  filtered = false;

  refreshChecked() {
    this.filtered = true;
    this.plan.taxes.forEach((t) => {
      this.checkedTaxes[t.taxId] = this.checkedTaxes[t.taxId];
    });
  }

  clear(planRestore?: TaxPlan) {
    this.status = 2;
    this.plan = new TaxPlan();
    debugger;
    this.rawTaxes.forEach((t) => {
      this.checkedTaxes[t.id] = [false, null];
    });
    this.filterAppIds = [];

    if (planRestore) {
      this.plan = {
        ...new TaxPlan(),
        ...JSON.parse(JSON.stringify(planRestore)),
      };
      this.plan.taxes.forEach((t) => {
        this.checkedTaxes[t.taxId] = [t.active, +t.rateId];
      });
      this.status = +this.oldPlan.active + 1;
      const ids = Object.entries(this.checkedTaxes)
        .filter(([_, value]) => value[0])
        .map(([id]) => +id);
      const filtered = this.rawTaxes.filter((t) =>
        ids.some((id) => id == t.id)
      );
      this.filterAppIds = [
        ...new Set(
          filtered
            .map((t) => t.applicationTypeIds)
            .reduce((acc, val) => acc.concat(val), [])
        ),
      ];
    }

    this.filterTableEmitter();
  }

  openNew() {
    this.clear();
    this.oldCheckedTaxes = { ...JSON.parse(JSON.stringify(this.checkedTaxes)) };

    this.isSaving = false;
    this.loaded = true;
    this.displayModal = true;
  }

  openEdit(plan: TaxPlan) {
    this.oldPlan = {
      ...new TaxPlan(),
      ...JSON.parse(JSON.stringify(plan)),
    };
    this.clear(plan);
    this.oldCheckedTaxes = { ...JSON.parse(JSON.stringify(this.checkedTaxes)) };

    this.isSaving = false;
    this.displayModal = true;
  }

  isSaving = false;

  filterRates(
    taxId: number,
    where: "normal" | "base" = "normal",
    rateId?: number
  ) {
    const options =
      where == "normal" ? this.rateOptions[taxId] : this.baseRateOptions[taxId];

    let ids = this.plan.taxes
      .filter((t) => t.active && t.taxId == taxId && t.rateId > 0)
      .map((t) => (where == "normal" ? +t.rateId : +t.baseRateId));

    const diffRateOptions = options.filter((r) =>
      ids.length ? !ids.includes(+r.value) : true
    );

    if (rateId && rateId > 0) {
      const selfRate =
        where == "normal"
          ? this.getRate(taxId, rateId)
          : this.getBaseRate(taxId, rateId);
      return this.ensure([selfRate, ...diffRateOptions]);
    }

    return diffRateOptions;
  }

  save() {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      message: "¿Está seguro de guardar los cambios?",
      accept: () => {
        this.filterTableEmitter();
        const model: TaxPlan = {
          ...new TaxPlan(),
          ...JSON.parse(JSON.stringify(this.plan)),
          name:
            this.plan.name &&
            this.plan.name[0].toUpperCase() + this.plan.name.slice(1),
          active: !!+(this.status - 1),
        };
        const ids = Object.entries(this.checkedTaxes)
          .filter(([_, value]) => value[0])
          .map(([id]) => +id);
        // const filtered = model.taxes.filter(t => ids.some(id => id == t.taxId))
        model.taxes = this.plan.taxes.map((t) => ({
          ...t,
          baseRateId: t.baseRateId > 0 ? t.baseRateId : -1,
          rateId: t.rateId > 0 ? t.rateId : -1,
        }));
        // model.taxes = Object.values(this.rawTaxes)
        //   .map((t) => {
        //     const tax = this.plan.taxes.find((pt) => pt.taxId == t.id);
        //     return {
        //       ...new TaxPlanDetail(),
        //       id: tax ? tax.id : -1,
        //       rateId: +this.checkedTaxes[t.id][1],
        //       active: this.checkedTaxes[t.id][0] ? tax.active : false,
        //     };
        //   })
        //   .filter((t) => (t.active ? t.rateId : true));

        this.service.post(model).subscribe((data) => {
          this.messageService.clear();
          if (data == -1) {
            this.messageService.add({
              severity: "error",
              summary: "Plan de impuestos duplicado",
              detail:
                "Ya se encuentra registrado un plan de impuestos con ese nombre",
              life: 5000,
            });
            return;
          }
          this.messageService.add({
            severity: "success",
            summary: "Guardado",
            detail: "Guardado exitoso",
            life: 5000,
          });
          this.onSave.emit();
          this.isSaving = true;
          this.displayModal = false;
          this.loaded = false;
          this.displayModalChange.emit(this.displayModal);
          this.clear();
        });
      },
    });
  }

  rateOptions: { [key: number]: SelectItem<number>[] } = {};
  baseRateOptions: { [key: number]: SelectItem<number>[] } = {};

  diffRateOptions: { [key: number]: SelectItem<number>[] } = {};
  diffBaseRateOptions: { [key: number]: SelectItem<number>[] } = {};

  getRateOptions = (rates: TaxPlanRate[]): SelectItem<number>[] =>
    rates.map((r) => ({
      label: `${r.abbreviation || r.name} - ${r.value}${
        r.typeId == 1 ? "%" : ""
      }`,
      value: r.id,
    }));

  canSave = (map: TaxesMap) =>
    // Object.entries(map)
    //   .filter((t) => this.rawTaxes.find((r) => r.id == +t[0]))
    //   .map((m) => m[1])
    //   .filter(([active]) => active)
    //   .every(([_, rateId]) => rateId) &&
    !!this.plan?.name?.trim() &&
    this.plan?.taxPlanApplicationTypeId &&
    this.plan.taxes.filter((t) => t.active && t.rateId > 0).length &&
    Object.values(map).filter(([active]) => active).length;

  hideDialog(modal = true) {
    this.displayModal = true;
    if (
      modal && !this.isSaving && this.plan.id != -1
        ? !deepCompare(this.plan, this.oldPlan) ||
          !deepCompare(this.checkedTaxes, this.oldCheckedTaxes) ||
          this.oldPlan.active != !!(this.status - 1)
        : JSON.stringify(this.plan) != JSON.stringify(new TaxPlan()) ||
          !deepCompare(this.checkedTaxes, this.oldCheckedTaxes)
    ) {
      this.confirmationService.confirm({
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        message:
          "¿Está seguro que desea cerrar el formulario? perderá los cambios realizados.",
        accept: () => {
          this.loaded = false;
          this.displayModal = false;
          this.displayModalChange.emit(this.displayModal);
          this.clear();
        },
        reject: () => {
          this.displayModal = true;
          this.displayModalChange.emit(this.displayModal);
        },
      });
    } else {
      this.isSaving = true;
      this.displayModal = false;
      this.displayModalChange.emit(this.displayModal);
      this.clear();
      this.loaded = false;
    }
  }
}
