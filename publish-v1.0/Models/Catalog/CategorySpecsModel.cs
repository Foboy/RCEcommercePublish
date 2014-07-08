using System;
using System.Collections.Generic;
using Nop.Web.Framework.Mvc;

namespace Nop.Web.Models.Catalog
{
    public class CategorySpecsModel : CategorySimpleModel
    {
        public CategorySpecsModel(CategorySimpleModel model)
        {
            this.Id = model.Id;
            this.Name = model.Name;
            this.NumberOfProducts = model.NumberOfProducts;
            this.SeName = model.SeName;
            this.PriceRanges = model.PriceRanges;
            this.SubCategories = model.SubCategories;
            this.PriceRangeFilter = new CatalogPagingFilteringModel.PriceRangeFilterModel();
            this.SpecificationFilter = new CatalogPagingFilteringModel.SpecificationFilterModel();
        }

        public CatalogPagingFilteringModel.PriceRangeFilterModel PriceRangeFilter { get; set; }

        /// <summary>
        /// Specification filter model
        /// </summary>
        public CatalogPagingFilteringModel.SpecificationFilterModel SpecificationFilter { get; set; }
    }
}