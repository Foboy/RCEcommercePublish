using System.Collections.Generic;
using System.Web.Mvc;
using FluentValidation.Attributes;
using Nop.Admin.Validators.Catalog;
using Nop.Web.Framework;
using Nop.Web.Framework.Localization;
using Nop.Web.Framework.Mvc;

namespace Nop.Admin.Models.Catalog
{
    [Validator(typeof(SpecificationAttributeValidator))]
    public partial class SpecificationAttributeModel : BaseNopEntityModel, ILocalizedModel<SpecificationAttributeLocalizedModel>
    {
        public SpecificationAttributeModel()
        {
            Locales = new List<SpecificationAttributeLocalizedModel>();
            AvailableCategories = new List<SelectListItem>();
        }

        [NopResourceDisplayName("Admin.Catalog.Attributes.SpecificationAttributes.Fields.Name")]
        [AllowHtml]
        public string Name { get; set; }

        [NopResourceDisplayName("Admin.Catalog.Attributes.SpecificationAttributes.Fields.DisplayOrder")]
        public int DisplayOrder {get;set;}


        public IList<SpecificationAttributeLocalizedModel> Locales { get; set; }

        //zheng

        public IList<SelectListItem> AvailableCategories { get; set; }

        //zheng

        public int SearchCategoryId { get; set; }

        //zheng
        public bool AllowFiltering { get; set; }

        //zheng
        public string CategoryName { get; set; }

    }

    public partial class SpecificationAttributeLocalizedModel : ILocalizedModelLocal
    {
        public int LanguageId { get; set; }

        [NopResourceDisplayName("Admin.Catalog.Attributes.SpecificationAttributes.Fields.Name")]
        [AllowHtml]
        public string Name { get; set; }
    }
}