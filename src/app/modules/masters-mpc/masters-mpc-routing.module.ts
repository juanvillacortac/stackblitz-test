import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultimediaUseComponent } from './multimedia-use/multimedia-use/multimedia-use.component';
import { ValidationRangeComponent } from './validation-range/validation-range/validation-range.component';
import { PackagingpresentationListComponent } from './packaging-presentation/packagingpresentation-list/packagingpresentation-list.component';
import { ProductorigintypeListComponent } from './product-origin-type/productorigintype-list/productorigintype-list.component';
import { AttributeagrupationListComponent } from './attribute-agrupation/attributeagrupation-list/attributeagrupation-list.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { ClassificationComponent } from './classifications/classification/classification.component';
import { GroupingunitmeasureComponent } from './grouping-unit-measure/groupingunitmeasure/groupingunitmeasure.component';
import { GtintypeComponent } from './gtin-type/gtintype/gtintype.component';
import { MeasurementunitsListComponent } from './measurement-units/measurementunits-list/measurementunits-list.component';
import { PackagingpresentationFilterPanelComponent } from './packaging-presentation/packagingpresentation-filter-panel/packagingpresentation-filter-panel.component';
import { TypeofpartsListComponent } from './parts-types/typeofparts-list/typeofparts-list.component';
import { WastageListComponent } from './wastage/wastage-list/wastage-list.component';
import { DescriptionListComponent } from './description-type/description-list/description-list.component';
import { ProductAssociationListComponent } from './product-association/product-association-list/product-association-list.component';
import { UseofpackagingListComponent } from './use-of-packaging/useofpackaging-list/useofpackaging-list.component';
import { AttributeListComponent } from './attribute/attribute-list/attribute-list.component';
import { AttributeOptionListComponent } from './attribute-option/attribute-option-list/attribute-option-list.component';
import { NormativesListComponent } from './normatives/normatives-list/normatives-list.component';
import { LayoutComponent } from '../layout/layout/layout.component';
import { AuthGuard } from 'src/app/guard/auth.guard';




const routes: Routes = [
  { path: '',
  component: LayoutComponent,
  canActivate: [AuthGuard],
  children: [
 // { path: 'packagingpresentation-list', component: PackagingpresentationFilterPanelComponent },
  { path: 'classification-list', component: ClassificationComponent },
  { path: 'attributeagrupation-list', component: AttributeagrupationListComponent },
  { path: 'typeofparts-list', component: TypeofpartsListComponent },
  { path: 'groupingunitmeasure', component: GroupingunitmeasureComponent },
  { path: 'measurementunits-list', component: MeasurementunitsListComponent },
  { path: 'category-list', component: CategoryListComponent },
  { path: 'packagingpresentation-list', component: PackagingpresentationListComponent },
  { path: 'productorigintype-list', component: ProductorigintypeListComponent },
  { path: 'multimediause', component: MultimediaUseComponent },
  { path: 'validationrange', component: ValidationRangeComponent },
  { path: 'gtintype', component: GtintypeComponent },
  { path: 'classification-list', component: ClassificationComponent },
  { path: 'wastage-list', component: WastageListComponent},
  { path: 'description-list', component: DescriptionListComponent},
  { path: 'product-association-list', component: ProductAssociationListComponent},
  { path: 'useofpackaging-list', component:UseofpackagingListComponent},
  {path: 'attribute-list', component: AttributeListComponent},
  {path: 'attribute-option-list', component: AttributeOptionListComponent},
  {path: 'normative-list', component: NormativesListComponent},
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersMpcRoutingModule { }
