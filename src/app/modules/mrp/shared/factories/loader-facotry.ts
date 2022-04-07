import { Injectable } from '@angular/core';
import { ProductcatalogService } from 'src/app/modules/products/shared/services/productcatalogservice/productcatalog.service';
import { IngredientLoader } from '../search-ingredients/implementations/ingredient-loader';
import { ProductLoader } from '../search-ingredients/implementations/product-loader';
import { ILoader } from '../search-ingredients/interfaces/loader';
import { IngredientsService } from '../services/ingredients.service';

export enum LoaderType {
  product,
  ingredient
}

@Injectable({
  providedIn: 'root'
})
export class LoaderFacotry {

  constructor(private readonly productCatalogService: ProductcatalogService, private readonly ingredientService: IngredientsService) { }

  createLoader(loaderType: LoaderType): ILoader {
    if (loaderType === LoaderType.product) {
      return new ProductLoader(this.productCatalogService);
    } else {
      if (loaderType === LoaderType.ingredient) {
        return new IngredientLoader(this.ingredientService);
      }
    }
  }
}

