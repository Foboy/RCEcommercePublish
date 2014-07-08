using FluentValidation;
using Nop.Admin.Models.Settings;
using System;
namespace Nop.Admin.Validators.Settings
{
    public class IndexSearchTagsValidator : AbstractValidator<IndexSearchTagsSettingModel>
    {
        public IndexSearchTagsValidator()
        {
            RuleFor(x => x.FirstTag).NotEmpty().WithMessage("标签不能为空");
            RuleFor(x => x.SecondTag).NotEmpty().WithMessage("标签不能为空");
            RuleFor(x => x.ThirdTag).NotEmpty().WithMessage("标签不能为空");
            RuleFor(x => x.FirstTag).Length(1, 4).WithMessage("标签长度不合法");
            RuleFor(x => x.SecondTag).Length(1, 4).WithMessage("标签长度不合法");
            RuleFor(x => x.ThirdTag).Length(1, 4).WithMessage("标签长度不合法");
        }
    }
}