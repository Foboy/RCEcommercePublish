using System;
using System.Web.Mvc;
using FluentValidation.Attributes;
using Nop.Admin.Validators.Catalog;
using Nop.Web.Framework;
using Nop.Web.Framework.Mvc;

namespace Nop.Admin.Models.Catalog
{
    public partial class ProductQuestionModel : BaseNopEntityModel
    {
        /// <summary>
        /// Gets or sets the title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the question text
        /// </summary>
        public string QuestionText { get; set; }

        /// <summary>
        /// OrderNum顺序
        /// </summary>
        public int OrderNum { get; set; }
    }
}