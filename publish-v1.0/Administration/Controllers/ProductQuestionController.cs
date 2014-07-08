using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Nop.Admin.Models.Catalog;
using Nop.Core.Domain.Catalog;
using Nop.Core.Domain.Customers;
using Nop.Services.Catalog;
using Nop.Services.Helpers;
using Nop.Services.Localization;
using Nop.Services.Security;
using Nop.Web.Framework;
using Nop.Web.Framework.Controllers;
using Nop.Web.Framework.Kendoui;

namespace Nop.Admin.Controllers
{
    public partial class ProductQuestionController : BaseAdminController
    {
        #region Fields

        private readonly IProductService _productService;
        private readonly IDateTimeHelper _dateTimeHelper;
        private readonly ILocalizationService _localizationService;
        private readonly IPermissionService _permissionService;

        #endregion Fields

        #region Constructors

        public ProductQuestionController(IProductService productService, IDateTimeHelper dateTimeHelper,
            ILocalizationService localizationService, IPermissionService permissionService)
        {
            this._productService = productService;
            this._dateTimeHelper = dateTimeHelper;
            this._localizationService = localizationService;
            this._permissionService = permissionService;
        }

        #endregion

        #region Utilities

        [NonAction]
        protected void PrepareProductQuestionModel(ProductQuestionModel model,
            ProductQuestion productQuestion, bool excludeProperties, bool formatReviewText)
        {
            if (model == null)
                throw new ArgumentNullException("model");

            if (productQuestion == null)
                throw new ArgumentNullException("ProductQuestion");

            model.Id = productQuestion.Id;
            model.OrderNum = productQuestion.OrderNum;
            model.QuestionText = productQuestion.QuestionText;
            model.Title = productQuestion.Title;
          
        }

        #endregion

        #region Methods

        //list
        public ActionResult Index()
        {
            return RedirectToAction("List");
        }

        public ActionResult List()
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageProductReviews))
                return AccessDeniedView();

            return View();
        }

        public ActionResult Add()
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageProductReviews))
                return AccessDeniedView();

            var model = new ProductQuestionModel();
            return View("Edit",model);
        }

        [HttpPost]
        public ActionResult List(DataSourceRequest command)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageProductReviews))
                return AccessDeniedView();

         var productQuestions = _productService.GetAllProductQuestion();
            var gridModel = new DataSourceResult
            {
                Data = productQuestions.PagedForCommand(command).Select(x =>
                {
                    var m = new ProductQuestionModel();
                    PrepareProductQuestionModel(m, x, false, true);
                    return m;
                }),
                Total = productQuestions.Count,
            };

            return Json(gridModel);
        }

        //edit
        public ActionResult Edit(int id)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageProductReviews))
                return AccessDeniedView();

            var productQuestion = _productService.GetProductQuestionById(id);
            if (productQuestion == null)
                //No product review found with the specified id
                return RedirectToAction("List");

            var model = new ProductQuestionModel();
            PrepareProductQuestionModel(model, productQuestion, false, false);
            return View(model);
        }

        [HttpPost, ParameterBasedOnFormName("save-continue", "continueEditing")]
        public ActionResult Edit(ProductQuestionModel model, bool continueEditing)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageProductReviews))
                return AccessDeniedView();

            var productQuestion = _productService.GetProductQuestionById(model.Id);
            if (productQuestion == null)
                //No product review found with the specified id
                return RedirectToAction("Add",model);

         
                productQuestion.Title = model.Title;
                productQuestion.QuestionText = model.QuestionText;
                productQuestion.OrderNum = model.OrderNum;
                _productService.UpdateProductQuestion(productQuestion);

                return continueEditing ? RedirectToAction("Edit", productQuestion.Id) : RedirectToAction("List");
            
        }
        
        //delete
        //[HttpPost]
        public ActionResult Delete(int id)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageProductReviews))
                return AccessDeniedView();

            var productQuestion = _productService.GetProductQuestionById(id);
            if (productQuestion == null)
                //No product review found with the specified id
                return RedirectToAction("List");

            _productService.DeleteProductQuestion(productQuestion);
            return RedirectToAction("List");
        }

      
        [HttpPost]
        [FormValueRequired("save")]
        public ActionResult Add(ProductQuestionModel model)
        {
            ProductQuestion productQuestion = new ProductQuestion();
            productQuestion.Title = model.Title;
            productQuestion.QuestionText = model.QuestionText;
            productQuestion.OrderNum = model.OrderNum;

            _productService.AddProductQuestion(productQuestion);

           return     RedirectToAction("List");
        }


        #endregion
    }
}
