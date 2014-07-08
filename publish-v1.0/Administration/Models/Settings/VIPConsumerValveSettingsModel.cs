using Nop.Web.Framework;
using Nop.Web.Framework.Mvc;
using Nop.Core.Configuration;

namespace Nop.Admin.Models.Settings
{
    public partial class VIPConsumerValveSettingsModel : BaseNopModel, ISettings
    {
        public int ActiveStoreScopeConfiguration { get; set; }


        [NopResourceDisplayName("Admin.Configuration.Settings.VIPConsumerValve.VIPConditionValue")]
        public int VIPConditionValue { get; set; }
        public bool VIPConditionValue_OverrideForStore { get; set; }
    }
}