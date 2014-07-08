using Nop.Web.Framework;
using Nop.Web.Framework.Mvc;
using Nop.Core.Configuration;
using FluentValidation.Attributes;
using Nop.Admin.Validators.Settings;

namespace Nop.Admin.Models.Settings
{
    [Validator(typeof(IndexSearchTagsValidator))]
    public partial class IndexSearchTagsSettingModel : BaseNopModel, ISettings
    {
        public int ActiveStoreScopeConfiguration { get; set; }


        [NopResourceDisplayName("Admin.Configuration.Settings.IndexSearchTags.FirstTag")]
        public string FirstTag { get; set; }
        public bool FirstTag_OverrideForStore { get; set; }
        [NopResourceDisplayName("Admin.Configuration.Settings.IndexSearchTags.SecondTag")]
        public string SecondTag { get; set; }

        public bool SecondTag_OverrideForStore { get; set; }
        [NopResourceDisplayName("Admin.Configuration.Settings.IndexSearchTags.ThirdTag")]
        public string ThirdTag { get; set; }

        public bool ThirdTag_OverrideForStore { get; set; }
    }
}