using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Routing;
using Nop.Core;
using Nop.Core.Infrastructure;
using Nop.Services.Logging;
using Nop.Web.Framework;
using Nop.Web.Framework.Controllers;
using Nop.Web.Framework.Security;
using Nop.Web.Framework.Seo;
using Nop.Core.Domain.Catalog;
using System.Text.RegularExpressions;

namespace Nop.Web.Controllers
{
    [CheckAffiliate]
    [StoreClosed]
    [PublicStoreAllowNavigation]
    [LanguageSeoCode]
    [NopHttpsRequirement(SslRequirement.NoMatter)]
    [WwwRequirement]
    public abstract partial class BasePublicController : BaseController
    {
        protected virtual ActionResult InvokeHttp404()
        {
            // Call target Controller and pass the routeData.
            IController errorController = EngineContext.Current.Resolve<Nop.Web.Controllers.CommonController>();

            var routeData = new RouteData();
            routeData.Values.Add("controller", "Common");
            routeData.Values.Add("action", "PageNotFound");

            errorController.Execute(new RequestContext(this.HttpContext, routeData));

            return new EmptyResult();
        }

        private static Regex scoreReg = new Regex(@"[\D]*?(\d+)[\D]*");
        protected int ParseScore(Product product)
        {
            //score
            if (string.IsNullOrWhiteSpace(product.AdminComment))
            {
                return 100;
            }
            else
            {
                string adminComment = product.AdminComment.Trim();

                var result = scoreReg.Match(adminComment).Groups;
                if (result.Count > 1)
                {
                    return Convert.ToInt32(result[1].Value);
                }
                else
                {
                    return 100;
                }
            }
        }

    }
}
