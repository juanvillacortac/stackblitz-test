import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MastersMpcRoutingModule } from './masters-mpc-routing.module';
import { TypeofpartsListComponent } from './parts-types/typeofparts-list/typeofparts-list.component';
import { FiltersPanelComponentTypeofParts } from './parts-types/filters-panel/filters-panel.component';
import { DialogNewComponentTypeofParts } from './parts-types/dialog-new/dialog-new.component';
import { MultimediaUseComponent } from './multimedia-use/multimedia-use/multimedia-use.component';
import { FiltersPanelComponentMultimediaUse } from './multimedia-use/filters-panel/filters-panel.component';
import { DialogNewComponentMultimediaUse } from './multimedia-use/dialog-new/dialog-new.component';
import { PackagingpresentationListComponent } from './packaging-presentation/packagingpresentation-list/packagingpresentation-list.component';
import { PackagingpresentationFilterPanelComponent } from './packaging-presentation/packagingpresentation-filter-panel/packagingpresentation-filter-panel.component';
import { PackagingpresentationPanelComponent } from './packaging-presentation/packagingpresentation-panel/packagingpresentation-panel.component'
import { ProductorigintypeListComponent } from './product-origin-type/productorigintype-list/productorigintype-list.component';
import { ProductorigintypeFilterPanelComponent } from './product-origin-type/productorigintype-filter-panel/productorigintype-filter-panel.component';
import { ProductorigintypePanelComponent } from './product-origin-type/productorigintype-panel/productorigintype-panel.component';
import { ValidationRangeComponent } from './validation-range/validation-range/validation-range.component';
import { FiltersPanelValidationrangeComponent } from './validation-range/filters-panel-validationrange/filters-panel-validationrange.component';
import { DialogNewValidationrangeComponent } from './validation-range/dialog-new-validationrange/dialog-new-validationrange.component';
import { AttributeagrupationListComponent } from './attribute-agrupation/attributeagrupation-list/attributeagrupation-list.component';
import { DialogNewComponent } from './attribute-agrupation/dialog-new/dialog-new.component';
import { FiltersPanelComponent } from './attribute-agrupation/filters-panel/filters-panel.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryPanelComponent } from './categories/category-list/category-panel/category-panel.component';
import { ClassificationDialogComponent } from './classifications/classification-dialog/classification-dialog.component';
import { ClassificationFilterPanelComponent } from './classifications/classification-filter-panel/classification-filter-panel.component';
import { ClassificationComponent } from './classifications/classification/classification.component';
import { DialogNewComponentGroupingUnitMeasure } from './grouping-unit-measure/dialog-new/dialog-new.component';
import { FiltersPanelComponentGroupingUnitMeasure } from './grouping-unit-measure/filters-panel/filters-panel.component';
import { GroupingunitmeasureComponent } from './grouping-unit-measure/groupingunitmeasure/groupingunitmeasure.component';
import { GtintypeFilterPanelComponent } from './gtin-type/gtintype-filter-panel/gtintype-filter-panel.component';
import { GtintypePanelComponent } from './gtin-type/gtintype-panel/gtintype-panel.component';
import { GtintypeComponent } from './gtin-type/gtintype/gtintype.component';
import { DialogNewComponentMU } from './measurement-units/dialog-new/dialog-new.component';
import { FiltersPanelComponentMU } from './measurement-units/filters-panel/filters-panel.component';
import { MeasurementunitsListComponent } from './measurement-units/measurementunits-list/measurementunits-list.component';
import { WastageListComponent } from './wastage/wastage-list/wastage-list.component';
import { WastageFilterComponent } from './wastage/wastage-filter/wastage-filter.component';
import { WastageDialogComponent } from './wastage/wastage-dialog/wastage-dialog.component';
import { DescriptionListComponent } from './description-type/description-list/description-list.component';
import { DescriptionDialogComponent } from './description-type/description-dialog/description-dialog.component';
import { DescriptionFilterComponent } from './description-type/description-filter/description-filter.component';
import { InsertTypeListComponent } from './insert-type/insert-type-list/insert-type-list.component';
import { InsertTypeDialogComponent } from './insert-type/insert-type-dialog/insert-type-dialog.component';
import { InsertTypeFilterComponent } from './insert-type/insert-type-filter/insert-type-filter.component';
import { ProductAssociationListComponent } from './product-association/product-association-list/product-association-list.component';
import { ProductAssociationFilterComponent } from './product-association/product-association-filter/product-association-filter.component';
import { ProductAssociationPanelComponent } from './product-association/product-association-panel/product-association-panel.component';
import { UseofpackagingDialogComponent } from './use-of-packaging/useofpackaging-dialog/useofpackaging-dialog.component';
import { UseofpackagingFilterComponent } from './use-of-packaging/useofpackaging-filter/useofpackaging-filter.component';
import { UseofpackagingListComponent } from './use-of-packaging/useofpackaging-list/useofpackaging-list.component';
import { AttributeOptionListComponent } from './attribute-option/attribute-option-list/attribute-option-list.component';
import { AttributeOptionPanelComponent } from './attribute-option/attribute-option-panel/attribute-option-panel.component';
import { AttributeOptionFilterComponent } from './attribute-option/attribute-option-filter/attribute-option-filter.component';
import { AttributeListComponent } from './attribute/attribute-list/attribute-list.component';
import { AttributePanelComponent } from './attribute/attribute-panel/attribute-panel.component';
import { AttributeFilterComponent } from './attribute/attribute-filter/attribute-filter.component';
import { CategoryleveldownComponent } from './categories/category-list/categoryleveldown/categoryleveldown/categoryleveldown.component';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { NormativesListComponent } from './normatives/normatives-list/normatives-list.component';
import { NormativesFilterPanelComponent } from './normatives/normatives-filter-panel/normatives-filter-panel.component';
import { NormativesPanelComponent } from './normatives/normatives-panel/normatives-panel.component';
import { PrimengModule } from "../primeng/primeng.module";
import { MastersModule } from "../masters/masters.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations:[
        AttributeagrupationListComponent,
        FiltersPanelComponent,
        DialogNewComponent,
        TypeofpartsListComponent,
        FiltersPanelComponentTypeofParts,
        DialogNewComponentTypeofParts,
        MeasurementunitsListComponent,
        FiltersPanelComponentMU,
        DialogNewComponentMU,
        GroupingunitmeasureComponent,
        FiltersPanelComponentGroupingUnitMeasure,
        DialogNewComponentGroupingUnitMeasure,
        MultimediaUseComponent,
        FiltersPanelComponentMultimediaUse,
        DialogNewComponentMultimediaUse,
        ValidationRangeComponent,
        DialogNewValidationrangeComponent,
        FiltersPanelValidationrangeComponent,
        PackagingpresentationListComponent,
        PackagingpresentationFilterPanelComponent,
        PackagingpresentationPanelComponent,
        ProductorigintypeListComponent,
        ProductorigintypeFilterPanelComponent,
        ProductorigintypePanelComponent,
        GtintypeComponent,
        GtintypeFilterPanelComponent,
        GtintypePanelComponent,
        ClassificationComponent,
        ClassificationDialogComponent,
        ClassificationFilterPanelComponent,
        ClassificationComponent,
        ClassificationDialogComponent,
        ClassificationFilterPanelComponent,
        CategoryListComponent,
        CategoryPanelComponent,
        WastageListComponent,
        WastageFilterComponent,
        WastageDialogComponent,
        DescriptionListComponent,
        DescriptionDialogComponent,
        DescriptionFilterComponent,
        InsertTypeListComponent,
        InsertTypeDialogComponent,
        InsertTypeFilterComponent,
        ProductAssociationListComponent,
        ProductAssociationFilterComponent,
        ProductAssociationPanelComponent,
        UseofpackagingDialogComponent,
        UseofpackagingFilterComponent,
        UseofpackagingListComponent,
        AttributeOptionListComponent,
        AttributeOptionPanelComponent,
        AttributeOptionFilterComponent,
        AttributeListComponent,
        AttributePanelComponent,
        AttributeFilterComponent,
        CategoryleveldownComponent,
        NormativesListComponent,
        NormativesFilterPanelComponent,
        NormativesPanelComponent,
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MastersMpcRoutingModule,
    FormsModule,
    CommonDirectiveModule,
    CommonAppModule,
    MastersModule,
    TranslateModule,
    PrimengModule
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class MastersMPCModule { }
