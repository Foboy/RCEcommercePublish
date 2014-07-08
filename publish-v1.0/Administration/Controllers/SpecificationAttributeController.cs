﻿using System;
using System.Linq;
using System.Web.Mvc;
using Nop.Admin.Models.Catalog;
using Nop.Core.Domain.Catalog;
using Nop.Services.Catalog;
using Nop.Services.Localization;
using Nop.Services.Logging;
using Nop.Services.Security;
using Nop.Web.Framework.Controllers;
using Nop.Web.Framework.Kendoui;
using Nop.Web.Framework.Mvc;
using System.Collections.Generic;
using System.Collections;

namespace Nop.Admin.Controllers
{
    public partial class SpecificationAttributeController : BaseAdminController
    {
        #region Fields

        private readonly ISpecificationAttributeService _specificationAttributeService;
        private readonly ICategorySpecificationAtrributeService _categorySpecificationAtrributeService;
        private readonly ICategoryService _categoryService;
        private readonly ILanguageService _languageService;
        private readonly ILocalizedEntityService _localizedEntityService;
        private readonly ILocalizationService _localizationService;
        private readonly ICustomerActivityService _customerActivityService;
        private readonly IPermissionService _permissionService;
        private readonly IProductService _productService;

        #endregion Fields

        #region Constructors

        public SpecificationAttributeController(ISpecificationAttributeService specificationAttributeService,
            ICategorySpecificationAtrributeService categorySpecificationAtrributeService,
            ICategoryService categoryService,
            ILanguageService languageService,
            ILocalizedEntityService localizedEntityService,
            ILocalizationService localizationService,
            ICustomerActivityService customerActivityService,
            IPermissionService permissionService, IProductService productService)
        {
            this._specificationAttributeService = specificationAttributeService;
            this._categorySpecificationAtrributeService = categorySpecificationAtrributeService;
            this._categoryService = categoryService;
            this._languageService = languageService;
            this._localizedEntityService = localizedEntityService;
            this._localizationService = localizationService;
            this._customerActivityService = customerActivityService;
            this._permissionService = permissionService;
            this._productService = productService;
        }

        #endregion

        #region Utilities

        [NonAction]
        protected void UpdateAttributeLocales(SpecificationAttribute specificationAttribute, SpecificationAttributeModel model)
        {
            foreach (var localized in model.Locales)
            {
                _localizedEntityService.SaveLocalizedValue(specificationAttribute,
                                                               x => x.Name,
                                                               localized.Name,
                                                               localized.LanguageId);
            }
        }

        [NonAction]
        public void UpdateOptionLocales(SpecificationAttributeOption specificationAttributeOption, SpecificationAttributeOptionModel model)
        {
            foreach (var localized in model.Locales)
            {
                _localizedEntityService.SaveLocalizedValue(specificationAttributeOption,
                                                               x => x.Name,
                                                               localized.Name,
                                                               localized.LanguageId);
            }
        }

        #endregion

        #region Specification attributes

        //list
        public ActionResult Index()
        {
            return RedirectToAction("List");
        }

        public ActionResult List()
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            return View();
        }

        [HttpPost]
        public ActionResult List(DataSourceRequest command)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var specificationAttributes = _specificationAttributeService
                .GetSpecificationAttributes(command.Page - 1, command.PageSize);
            var gridModel = new DataSourceResult
            {
                Data = specificationAttributes.Select(x => x.ToModel()),
                Total = specificationAttributes.TotalCount
            };
            var AllCategorySpecificationAtrributes = _categorySpecificationAtrributeService.LoadAllCategorySpecificationAtrribute();
            List<SpecificationAttributeModel> collection = new List<SpecificationAttributeModel>();
            foreach (SpecificationAttributeModel item in gridModel.Data)
            {
                var e = AllCategorySpecificationAtrributes.ToList().Find(s => s.SpecificationAttributeId == item.Id);
                if (e != null)
                {
                    item.SearchCategoryId = e.CategoryId;
                    item.AllowFiltering = e.AllowFiltering;
                    var categories = _categoryService.GetCategoryById(e.CategoryId);
                    item.CategoryName = categories.Name;
                }
                collection.Add(item);
            }
            gridModel.Data = collection;
            //
            //foreach (var c in categories)
            //    model.AvailableCategories.Add(new SelectListItem() { Text = c.GetFormattedBreadCrumb(categories), Value = c.Id.ToString() });


            return Json(gridModel);
        }

        //create
        public ActionResult Create()
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var model = new SpecificationAttributeModel();
            //categories
            model.AvailableCategories.Add(new SelectListItem() { Text = _localizationService.GetResource("Admin.Common.All"), Value = "0" });
            var categories = _categoryService.GetAllCategoriesByParentCategoryId(0,showHidden: true);
            foreach (var c in categories)
                model.AvailableCategories.Add(new SelectListItem() { Text = c.GetFormattedBreadCrumb(categories), Value = c.Id.ToString() });
            //locales
            AddLocales(_languageService, model.Locales);
            return View(model);
        }

        [HttpPost, ParameterBasedOnFormName("save-continue", "continueEditing")]
        public ActionResult Create(SpecificationAttributeModel model, bool continueEditing)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            if (ModelState.IsValid)
            {
                var specificationAttribute = model.ToEntity();
                _specificationAttributeService.InsertSpecificationAttribute(specificationAttribute);
                UpdateAttributeLocales(specificationAttribute, model);

                //activity log
                _customerActivityService.InsertActivity("AddNewSpecAttribute", _localizationService.GetResource("ActivityLog.AddNewSpecAttribute"), specificationAttribute.Name);
                _categorySpecificationAtrributeService.InsertCategorySpecificationAtrribute(new CategorySpecificationAtrribute { AllowFiltering = model.AllowFiltering, CategoryId = model.SearchCategoryId, Deleted = false, SpecificationAttributeId = specificationAttribute.Id });

                SuccessNotification(_localizationService.GetResource("Admin.Catalog.Attributes.SpecificationAttributes.Added"));
                return continueEditing ? RedirectToAction("Edit", new { id = specificationAttribute.Id }) : RedirectToAction("List");
            }

            //If we got this far, something failed, redisplay form
            return View(model);
        }

        //edit
        public ActionResult Edit(int id)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var specificationAttribute = _specificationAttributeService.GetSpecificationAttributeById(id);

            if (specificationAttribute == null)
                //No specification attribute found with the specified id
                return RedirectToAction("List");
            var model = specificationAttribute.ToModel();
            //locales
            AddLocales(_languageService, model.Locales, (locale, languageId) =>
            {
                locale.Name = specificationAttribute.GetLocalized(x => x.Name, languageId, false, false);
            });

            var e = _categorySpecificationAtrributeService.GetCategorySpecificationAtrributeBySid(specificationAttribute.Id);
            if (e != null) { 
            model.AllowFiltering = e.AllowFiltering;
            model.SearchCategoryId = e.CategoryId;
            }
            model.AvailableCategories.Add(new SelectListItem() { Text = _localizationService.GetResource("Admin.Common.All"), Value = "0" });
            var categories = _categoryService.GetAllCategoriesByParentCategoryId(0,showHidden: true);
            foreach (var c in categories)
                model.AvailableCategories.Add(new SelectListItem() { Text = c.GetFormattedBreadCrumb(categories), Value = c.Id.ToString() });
            return View(model);
        }

        [HttpPost, ParameterBasedOnFormName("save-continue", "continueEditing")]
        public ActionResult Edit(SpecificationAttributeModel model, bool continueEditing)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var specificationAttribute = _specificationAttributeService.GetSpecificationAttributeById(model.Id);
            if (specificationAttribute == null)
                //No specification attribute found with the specified id
                return RedirectToAction("List");

            if (ModelState.IsValid)
            {
                specificationAttribute = model.ToEntity(specificationAttribute);
                _specificationAttributeService.UpdateSpecificationAttribute(specificationAttribute);

                UpdateAttributeLocales(specificationAttribute, model);

                //activity log
                _customerActivityService.InsertActivity("EditSpecAttribute", _localizationService.GetResource("ActivityLog.EditSpecAttribute"), specificationAttribute.Name);
                _categorySpecificationAtrributeService.UpdateCategorySpecificationAtrribute(new CategorySpecificationAtrribute { AllowFiltering = model.AllowFiltering, CategoryId = model.SearchCategoryId, Deleted = false, SpecificationAttributeId = specificationAttribute.Id });
                SuccessNotification(_localizationService.GetResource("Admin.Catalog.Attributes.SpecificationAttributes.Updated"));

                if (continueEditing)
                {
                    //selected tab
                    SaveSelectedTabIndex();

                    return RedirectToAction("Edit", specificationAttribute.Id);
                }
                else
                {
                    return RedirectToAction("List");
                }
            }

            //If we got this far, something failed, redisplay form
            return View(model);
        }

        //delete
        [HttpPost]
        public ActionResult Delete(int id)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var specificationAttribute = _specificationAttributeService.GetSpecificationAttributeById(id);
            if (specificationAttribute == null)
                //No specification attribute found with the specified id
                return RedirectToAction("List");

            _specificationAttributeService.DeleteSpecificationAttribute(specificationAttribute);

            //activity log
            _customerActivityService.InsertActivity("DeleteSpecAttribute", _localizationService.GetResource("ActivityLog.DeleteSpecAttribute"), specificationAttribute.Name);

            SuccessNotification(_localizationService.GetResource("Admin.Catalog.Attributes.SpecificationAttributes.Deleted"));
            return RedirectToAction("List");
        }

        #endregion

        #region Specification attribute options

        //list
        [HttpPost]
        public ActionResult OptionList(int specificationAttributeId, DataSourceRequest command)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var options = _specificationAttributeService.GetSpecificationAttributeOptionsBySpecificationAttribute(specificationAttributeId);
            var gridModel = new DataSourceResult
            {
                Data = options.Select(x =>
                    {
                        var model = x.ToModel();
                        //in order to save performance to do not check whether a product isn't deleted
                        model.NumberOfAssociatedProducts = x.ProductSpecificationAttributes.Count;
                        //locales
                        //AddLocales(_languageService, model.Locales, (locale, languageId) =>
                        //{
                        //    locale.Name = x.GetLocalized(y => y.Name, languageId, false, false);
                        //});
                        return model;
                    }),
                Total = options.Count()
            };

            return Json(gridModel);
        }

        //create
        public ActionResult OptionCreatePopup(int specificationAttributeId)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var model = new SpecificationAttributeOptionModel();
            model.SpecificationAttributeId = specificationAttributeId;
            //locales
            AddLocales(_languageService, model.Locales);
            return View(model);
        }

        [HttpPost]
        public ActionResult OptionCreatePopup(string btnId, string formId, SpecificationAttributeOptionModel model)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var specificationAttribute = _specificationAttributeService.GetSpecificationAttributeById(model.SpecificationAttributeId);
            if (specificationAttribute == null)
                //No specification attribute found with the specified id
                return RedirectToAction("List");

            if (ModelState.IsValid)
            {
                var sao = model.ToEntity();

                _specificationAttributeService.InsertSpecificationAttributeOption(sao);
                UpdateOptionLocales(sao, model);

                ViewBag.RefreshPage = true;
                ViewBag.btnId = btnId;
                ViewBag.formId = formId;
                return View(model);
            }

            //If we got this far, something failed, redisplay form
            return View(model);
        }

        //edit
        public ActionResult OptionEditPopup(int id)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var sao = _specificationAttributeService.GetSpecificationAttributeOptionById(id);
            if (sao == null)
                //No specification attribute option found with the specified id
                return RedirectToAction("List");

            var model = sao.ToModel();
            //locales
            AddLocales(_languageService, model.Locales, (locale, languageId) =>
            {
                locale.Name = sao.GetLocalized(x => x.Name, languageId, false, false);
            });

            return View(model);
        }

        [HttpPost]
        public ActionResult OptionEditPopup(string btnId, string formId, SpecificationAttributeOptionModel model)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var sao = _specificationAttributeService.GetSpecificationAttributeOptionById(model.Id);
            if (sao == null)
                //No specification attribute option found with the specified id
                return RedirectToAction("List");

            if (ModelState.IsValid)
            {
                sao = model.ToEntity(sao);
                _specificationAttributeService.UpdateSpecificationAttributeOption(sao);

                UpdateOptionLocales(sao, model);

                ViewBag.RefreshPage = true;
                ViewBag.btnId = btnId;
                ViewBag.formId = formId;
                return View(model);
            }

            //If we got this far, something failed, redisplay form
            return View(model);
        }

        //delete
        [HttpPost]
        public ActionResult OptionDelete(int id, int specificationAttributeId)
        {
            if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
                return AccessDeniedView();

            var sao = _specificationAttributeService.GetSpecificationAttributeOptionById(id);
            if (sao == null)
                throw new ArgumentException("No specification attribute option found with the specified id");

            _specificationAttributeService.DeleteSpecificationAttributeOption(sao);

            return new NullJsonResult();
        }


        //ajax
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult GetOptionsByAttributeId(string attributeId)
        {
            //do not make any permission validation here 
            //because this method could be used on some other pages (such as product editing)
            //if (!_permissionService.Authorize(StandardPermissionProvider.ManageAttributes))
            //    return AccessDeniedView();

            // This action method gets called via an ajax request
            if (String.IsNullOrEmpty(attributeId))
                throw new ArgumentNullException("attributeId");

            var options = _specificationAttributeService.GetSpecificationAttributeOptionsBySpecificationAttribute(Convert.ToInt32(attributeId));
            var result = (from o in options
                          select new { id = o.Id, name = o.Name }).ToList();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //ajax
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult GetSpecificationAttributesByCategoryId(string categoryId)
        {
           
            // This action method gets called via an ajax request
            if (String.IsNullOrEmpty(categoryId))
                throw new ArgumentNullException("categoryId");

            var options = _categorySpecificationAtrributeService.LoadCategorySpecificationAtrributeById(Convert.ToInt32(categoryId));
            var result = (from o in options
                          select new { id = o.SpecificationAttributeId }).ToList();
            ArrayList list = new ArrayList();
            foreach (var item in result)
            {
               var cat=  _specificationAttributeService.GetSpecificationAttributeById(item.id);
               var e = new { id = item.id, name = cat.Name };
               list.Add(e);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}