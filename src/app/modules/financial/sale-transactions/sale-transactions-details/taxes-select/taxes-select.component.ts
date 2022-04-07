import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { BreadcrumbService } from "src/app/design/breadcrumb.service";
import { ColumnD } from "src/app/models/common/columnsd";
import { SupplierClasification } from "src/app/models/masters/supplier-clasification";
import { SupplierExtend } from "src/app/models/masters/supplier-extend";
import {
  TaxPlan,
  TaxPlanFilter,
  TaxPlanRawTax,
} from "src/app/models/masters/tax-plan";
import { TaxeTypeApplication } from "src/app/models/masters/taxe-type-application";
import { LoadingService } from "src/app/modules/common/components/loading/shared/loading.service";
import { SupplierService } from "src/app/modules/masters/supplier/shared/services/supplier.service";
import { SupplierclasificationService } from "src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service";
import { TaxPlanService } from "src/app/modules/masters/tax-plan/shared/services/tax-plan.service";
import { TaxeTypeApplicationService } from "src/app/modules/masters/taxe-type-application/shared/taxe-type-application.service";
import { UserPermissions } from "src/app/modules/security/users/shared/user-permissions.service";
import { AccountingPlanBase } from "../../../initial-setup/shared/accounting-plan-base.component";

type Distribution = {
  accountId: number;
  account: string;
  accountCode: string;
  auxiliaryId: number;
  auxiliary: string;
  indAux: boolean;
  direction: "credit" | "debit";
};

export type TaxMeta = {
  transactionSalesArticleTaxId?: number;
  artId?: number;
  origin?: number;
  rateId?: number;
  fromPlan?: boolean;
  rateValue?: number;
  baseTaxRateId?: number;
  baseTaxRateValue?: number;
  active?: boolean;
  edit?: boolean;
};

export type TaxWOriginComplete = TaxPlanRawTax & TaxMeta;
export type TaxWOrigin = TaxWOriginComplete | ({ id: number } & TaxMeta);

function mutationFilter<T>(arr: T[], cb: (val: T) => boolean) {
  for (let l = arr.length - 1; l >= 0; l -= 1) {
    if (!cb(arr[l])) arr.splice(l, 1);
  }
}

@Component({
  selector: "app-sale-transactions-taxes-select",
  templateUrl: "./taxes-select.component.html",
  styleUrls: ["./taxes-select.component.scss"],
})
export class SaleTransactionsTaxesSelectComponent
  extends AccountingPlanBase
  implements OnInit
{
  submitted = false;

  cols: ColumnD<Distribution>[] = [
    {
      template: (p) => p.account,
      header: "Descripción",
      display: "table-cell",
    },
    {
      template: (p) => this.formatCode(p.accountCode),
      header: "Cuenta contable",
      display: "table-cell",
    },
    {
      template: (p) => "Transacción bancaria",
      header: "Tipo",
      display: "table-cell",
    },
    {
      template: (p) => (p.indAux ? p.auxiliary : "N/A"),
      header: "Auxiliar",
      display: "table-cell",
    },
  ];

  taxCols: ColumnD<TaxWOriginComplete>[] = [
    {
      template: (t) => t.id,
      field: "id",
      header: "Código",
      display: "table-cell",
    },
    {
      template: (t) => t.abbreviation || t.name,
      field: "abbreviation",
      header: "Impuesto",
      display: "table-cell",
    },
    {
      template: (t) =>
        t.baseTaxId !== 0
          ? this.taxData.raws.find((rt) => rt.id == t.baseTaxId)
              ?.abbreviation || t.baseTax
          : "N/A",
      field: "baseTax",
      header: "Impuesto base",
      display: "table-cell",
    },
    {
      template: (t) =>
        t.origin == -1 ? "Transacción (Factura)" : "Plan de impuestos",
      field: "origin",
      header: "Origen",
      display: "table-cell",
    },
    {
      template: (t) => null,
      field: "rate",
      header: "Tasa",
      display: "table-cell",
    },
    {
      template: (t) => null,
      field: "baseRate",
      header: "Tasa de impuesto base",
      display: "table-cell",
    },
  ];

  constructor(
    public breadcrumbService: BreadcrumbService,
    public userPermissions: UserPermissions,
    private taxPlanService: TaxPlanService,
    private taxAppTypeService: TaxeTypeApplicationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    injector: Injector
  ) {
    super(injector);
  }

  clientModal = false;

  maxPostingDate: Date;

  ngOnInit() {
    this.maxPostingDate = new Date();

    this.fetchTaxData();
  }

  toDate = (date: string | Date) => new Date(date);

  // TAX

  taxPlan: number;
  @Input()
  set plan(value: number) {
    this.taxPlan = value;
    this.setTaxTable(this.taxes || [], this.taxPlan || -1);
  }

  get plan() {
    return this.taxPlan;
  }

  taxData: {
    plans?: TaxPlan[];
    raws?: TaxPlanRawTax[];
    types?: TaxeTypeApplication[];
    wOrigin?: TaxWOrigin[];
    wOriginTable?: TaxWOrigin[];
  } = {
    plans: [],
    raws: [],
    types: [],
    wOrigin: [],
    wOriginTable: [],
  };

  @Input() taxes: TaxWOrigin[] = [];
  @Output() taxesChange = new EventEmitter<TaxWOrigin[]>();

  getTaxTableLength = (taxTable: TaxWOrigin[]) =>
    taxTable.filter((t) => t.active).length;

  existOnPlan = (taxId: number, rateId: number) =>
    this.taxData.plans
      .find((p) => this.taxPlan == p.id)
      ?.taxes.find((t) => t.taxId == taxId && t.rateId == +rateId);

  addTaxToTable(
    props: {
      selectedTax;
      selectedRate;
      selectedBaseTaxRate;
    },
    taxes?: TaxWOrigin[]
  ) {
    const { selectedTax, selectedRate, selectedBaseTaxRate } = props;
    const arr = taxes || this.taxes;
    const tax = this.taxData.raws.find((t) => +selectedTax === t.id);
    const wOrigin = [
      ...(arr.map((t) => ({
        ...(this.taxData.raws.find((raw) => +selectedTax === t.id) ?? {}),
        ...t,
        edit: false,
      })) || []),
    ];
    if (
      tax &&
      selectedRate &&
      (this.getBaseTax(tax.id)?.baseTaxId
        ? selectedBaseTaxRate && selectedBaseTaxRate > 0
        : true)
    ) {
      const idx = wOrigin.findIndex((t) => t.id == tax.id);
      const planTax = this.taxData.wOriginTable
        .filter((t) => t.origin !== -1)
        ?.find((t) => t.id == tax.id);
      if (+selectedRate === planTax?.rateId) {
        this.messageService.clear();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Impuesto ya registrado con la tasa seleccionada",
        });
        return;
      }
      if (
        this.taxData.plans
          .find((p) => this.taxPlan == p.id)
          ?.taxes.some((t) => t.taxId == tax.id) &&
        idx < 0
      ) {
        this.messageService.clear();
        this.messageService.add({
          severity: "info",
          summary: "Impuestos reemplazados",
          detail: "Uno o más impuestos han cambiado de origen",
        });
      }
      if (idx >= 0) {
        const newTax = {
          ...wOrigin[idx],
          origin: -1,
          active: !this.existOnPlan(wOrigin[idx].id, +selectedRate),
          fromPlan: false,
          rateId: +selectedRate,
          baseTaxRateId: +selectedBaseTaxRate,
          edit: false,
        };
        this.setRate(newTax, +selectedRate);
        if (selectedBaseTaxRate && selectedBaseTaxRate > 0) {
          this.setBaseRate(newTax, +selectedBaseTaxRate);
        }
        wOrigin[idx] = newTax;
      } else {
        const newTax = {
          ...tax,
          origin: -1,
          active: true,
          fromPlan: false,
          edit: false,
          rateId: +selectedRate,
          baseTaxRateId: +selectedBaseTaxRate,
        };
        this.setRate(newTax, +selectedRate);
        if (selectedBaseTaxRate) {
          this.setBaseRate(newTax, +selectedBaseTaxRate);
        }
        wOrigin.push(newTax);
      }
      this.taxes = wOrigin;
      this.setTaxTable(this.taxes || [], this.taxPlan || -1);
    }
  }

  resetTax(id: number) {
    this.confirmationService.confirm({
      header: "Advertencia",
      icon: "pi pi-exclamation-triangle",
      message:
        "¿Está seguro que desea cambiar la tasa actual por la seleccionada? el origen del impuesto cambiará a Plan de impuestos.",
      accept: () => {
        this.delTaxFromTable(id, false);
      },
      reject: () => {
        const idx = this.taxData.wOriginTable.findIndex((t) => t.id == id);
        this.taxData.wOriginTable[idx].edit = false;
      },
    });
  }

  delTaxFromTable(id: number, confirm = true) {
    const del = () => {
      const idx = this.taxes.findIndex((t) => t.id == id);
      this.taxes[idx].active = false;
      this.taxes[idx].edit = false;
      this.taxesChange.emit(this.taxes);
      this.setTaxTable(this.taxes || [], this.taxPlan || -1);
    };
    if (confirm) {
      this.confirmationService.confirm({
        header: "Confirmación",
        icon: "pi pi-exclamation-triangle",
        message: "¿Está seguro que desea borrar el impuesto?",
        accept: del,
      });
    } else {
      del();
    }
  }

  getBaseTax = (taxId: number) => {
    const tax = this.taxData.raws.find((rt) => rt.id == +taxId);
    if (tax?.baseTaxId) {
      return this.taxData.raws.find((rt) => rt.id == tax.baseTaxId);
    }
  };

  changeRateOption(idrate: number, tax: TaxWOrigin) {
    if (tax.origin != -1) {
      tax.origin = -1;
      this.taxes.push({ ...tax });
      this.taxes = this.taxes;
    }
    const idx = this.taxes.findIndex((t) => t.id == tax.id);
    this.taxes[idx].rateId = idrate;
    this.setTaxTable(this.taxes, this.taxPlan || -1);
    console.log("Edit", idrate, this.taxData.wOriginTable);
  }

  setRate(tax: TaxWOrigin, rateId: number) {
    tax.edit = false;
    tax.rateId = +rateId;
    const rates = this.getRates(tax.id);
    tax.rateValue = rates.find((r) => r.id == rateId).value;
  }

  setBaseRate(tax: TaxWOrigin, rateId: number) {
    tax.edit = false;
    tax.baseTaxRateId = +rateId;
    const rates = this.getBaseRates(tax.id);
    tax.baseTaxRateValue = rates.find((r) => r.id == rateId).value;
  }

  setTaxTable(
    taxes: TaxWOrigin[] = this.taxes || [],
    planId: number = this.taxPlan || -1
  ) {
    const plan = this.taxData.plans.find((p) => p.id == planId);
    const planTaxes = plan
      ? plan.taxes
          .filter(
            (t) => t.active && this.taxData.raws.find((r) => t.taxId == r.id)
          )
          .map((pt) => ({
            ...this.taxData.raws.find((r) => r.id == pt.taxId),
            rateId: pt.rateId,
            origin: plan.id,
            active: true,
            edit: false,
          }))
      : [];

    const older =
      taxes.filter((t) => t.origin == -1 && t.active) ||
      taxes.filter((t) => t.active);

    // const filteredPlanTaxes = planTaxes.filter(pt => !older.some(t => t.id == pt.id))
    // this.taxData.wOriginTable = [
    //   ...filteredPlanTaxes,
    //   ...(filteredPlanTaxes?.length ? older.filter(t => planTaxes.some(pt => pt.id != t.id)) : older)
    // ]

    // TODO

    const filteredPlanTaxes = older.length
      ? planTaxes.filter(
          (pt) =>
            older.find((t) => pt.id == t.id && pt.rateId == t.rateId) ||
            !older.find((t) => pt.id == t.id)
        )
      : planTaxes;

    const filteredArtTaxes = filteredPlanTaxes?.length
      ? older.filter((t) => !filteredPlanTaxes.find((pt) => pt.id == t.id))
      : older;

    this.taxData.wOriginTable = [...filteredPlanTaxes.map(t => ({...t, fromPlan: true})), ...filteredArtTaxes];
    this.taxesChange.emit(this.taxData.wOriginTable);
  }

  getArticleTaxes = () => {
    return this.taxes.map((t) => ({
      tasaImpuestoId: +t.rateId,
      activeImpuesto: t.active,
      articuloImpuestoId: t.artId || -1,
    }));
  };

  getTaxPlansList = (plans: TaxPlan[]) => [
    ...plans.map((p) => ({
      label: p.abbreviation || p.name,
      value: p.id,
    })),
  ];

  taxTypeFilterIds: number[] = [];
  selectedTax: number;
  selectedRate: number;
  selectedBaseTaxRate: number;

  log = console.log;

  getTaxList = (
    taxes: TaxPlanRawTax[],
    ids: number[],
    wOrigin: TaxWOrigin[]
  ) => [
    ...(ids?.length
      ? taxes.filter((t) =>
          ids.some((id) => t.applicationTypeIds.some((tid) => tid == id))
        )
      : taxes
    ).map((p) => ({
      label: p.abbreviation + "-" + p.name,
      value: p.id,
    })),
  ];

  getRateOptions = (taxId): SelectItem<number>[] =>
    this.taxData.raws
      .find((t) => t.id == taxId)
      ?.rates.map((r) => ({
        label: `${r.name} - ${r.value}${r.typeId == 1 ? "%" : ""}`,
        value: r.id,
      }));

  getRates = (taxId: number) =>
    this.taxData.raws.find((t) => t.id == taxId)?.rates;
  getBaseRates = (taxId: number) =>
    this.taxData.raws.find((t) => t.id == taxId)?.baseTaxRates;

  getBaseRateOptions = (taxId): SelectItem<number>[] =>
    this.taxData.raws
      .find((t) => t.id == taxId)
      ?.baseTaxRates.map((r) => ({
        label: `${r.name} - ${r.value}${r.typeId == 1 ? "%" : ""}`,
        value: r.id,
      })) || [];

  setRateOptions = () => {
    this.taxData.raws.forEach((t) => {
      this.rateOptions[t.id] = t?.rates.map((r) => ({
        label: `${r.name} - ${r.value}${r.typeId == 1 ? "%" : ""}`,
        value: r.id,
      }));
      this.baseRateOptions[t.id] = t?.baseTaxRates.map((r) => ({
        label: `${r.name} - ${r.value}${r.typeId == 1 ? "%" : ""}`,
        value: r.id,
      }));
    });
  };

  getRateName = (taxId: number, rateId: number) =>
    this.getRateOptions(taxId)?.find((r) => r.value == rateId)?.label;
  getBaseRateName = (taxId: number, rateId: number) =>
    this.getBaseRateOptions(taxId)?.find((r) => r.value == rateId)?.label;

  coinsOptions: SelectItem<number>[];

  rateOptions = {};
  baseRateOptions = {};

  fetchTaxData() {
    return this.taxPlanService
      .getList({ ...new TaxPlanFilter(), active: 1 })
      .toPromise()
      .then(
        (plans) =>
          (this.taxData.plans = plans
            .filter((p) => p.taxes.length)
            .sort((a, b) => a.name.localeCompare(b.name)))
      )
      .then(() => this.taxPlanService.getRawTaxes().toPromise())
      .then((taxes) => {
        this.taxData.raws = taxes
          .filter((t) => t.rates.length)
          .sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
        this.setRateOptions();
      })
      .then(() =>
        this.taxAppTypeService.getTaxeTypeApplications({
          id: -1,
          active: 1,
          name: "",
        })
      )
      .then((types: TaxeTypeApplication[]) => {
        this.taxData.types = types.sort((a, b) =>
          a.abbreviation.localeCompare(b.abbreviation)
        );
        // this.taxTypeFilterIds = this.taxData.types.map(t => t.id)
      })
      .then(() => {
        this.setTaxTable([], this.taxPlan || -1);
        if (this.taxes) {
          const taxes = [...this.taxes];
          taxes.forEach((t) => {
            this.addTaxToTable({
              selectedTax: t.id,
              selectedRate: t.rateId,
              selectedBaseTaxRate: t.baseTaxRateId,
            });
          });
        }
      });
  }
}
