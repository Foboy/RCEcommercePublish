using System;
using System.Collections.Generic;
using Nop.Web.Framework.Mvc;
using Nop.Core.Domain.Catalog;

namespace Nop.Web.Models.Catalog
{
    public partial class TopSpecsMenuModel : BaseNopModel
    {
        public TopSpecsMenuModel()
        {
            Categories = new List<CategorySpecsModel>();
        }

        public IList<CategorySpecsModel> Categories { get; set; }


        public bool BlogEnabled { get; set; }
        public bool RecentlyAddedProductsEnabled { get; set; }
        public bool ForumEnabled { get; set; }
    }
}