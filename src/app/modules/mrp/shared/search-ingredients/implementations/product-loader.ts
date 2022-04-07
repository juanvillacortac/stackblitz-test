import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';
import { ProductcatalogFilter } from 'src/app/modules/products/shared/filters/productcatalog-filter';
import { ProductcatalogService } from 'src/app/modules/products/shared/services/productcatalogservice/productcatalog.service';
import { ILoader } from '../interfaces/loader';

export class ProductLoader implements ILoader {

    constructor(private productCatalogService: ProductcatalogService) {
    }

    load(filter: IngredientFilter) {
        return this.productCatalogService.getProductCatalogbyfilter(this.getFiltersFromIngredientFilter(filter)).toPromise();
    }

    private getFiltersFromIngredientFilter(filter: IngredientFilter) {
        const productFilter = new ProductcatalogFilter();
        productFilter.barcode = filter ? filter.ean ? filter.ean.toString() : '' : '';
        productFilter.name = filter ? filter.name ? filter.name : '' : '';
        productFilter.statusId = 4; // only created
        return productFilter;
    }

}
