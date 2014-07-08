using System.Collections.Generic;
using Nop.Web.Framework.Mvc;
using Nop.Web.Models.Media;
using System;

namespace Nop.Web.Models.Catalog
{
    public partial class ProductSModel : BaseNopEntityModel
    {
        public ProductSModel()
        {
            PictureModel = new PictureModel();
            FeaturedProducts = new List<ProductOverviewModel>();
            Products = new List<ProductOverviewModel>();
            PagingFilteringContext = new ProductPagingFilteringModel();
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public string MetaKeywords { get; set; }
        public string MetaDescription { get; set; }
        public string MetaTitle { get; set; }
        public string SeName { get; set; }

        public IEnumerable<string> dateList { get; set; }
        
        public PictureModel PictureModel { get; set; }

        public ProductPagingFilteringModel PagingFilteringContext { get; set; }


        public IList<ProductOverviewModel> FeaturedProducts { get; set; }
        public IList<ProductOverviewModel> Products { get; set; }
        

    }
}