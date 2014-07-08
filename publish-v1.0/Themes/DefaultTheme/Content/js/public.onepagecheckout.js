/*
** nopCommerce one page checkout
*/


var Checkout = {
    loadWaiting: false,
    failureUrl: false,

    init: function (failureUrl) {
        this.loadWaiting = false;
        this.failureUrl = failureUrl;

        //Accordion.disallowAccessToNextSections = false;
    },

    ajaxFailure: function () {
        location.href = Checkout.failureUrl;
    },
    
    _disableEnableAll: function (element, isDisabled) {
        var descendants = element.find('*');
        $(descendants).each(function() {
            if (isDisabled) {
                $(this).attr('disabled', 'disabled');
            } else {
                $(this).removeAttr('disabled');
            }
        });

        if (isDisabled) {
                element.attr('disabled', 'disabled');
            } else {
                element.removeAttr('disabled');
            }
    },

    setLoadWaiting: function (step, keepDisabled) {
        if (step) {
            
            $("#checkoutToPay").val("正在加载").attr("disabled", true);
        }
        else {
            $("#checkoutToPay").val("立即下单").attr("disabled", false);
        }
        if (step) {
            if (this.loadWaiting) {
                this.setLoadWaiting(false);
            }
            var container = $('#' + step + '-buttons-container');
            container.addClass('disabled');
            container.css('opacity', '.5');
            this._disableEnableAll(container, true);
            $('#' + step + '-please-wait').show();
        } else {
            if (this.loadWaiting) {
                var container = $('#' + this.loadWaiting + '-buttons-container');
                var isDisabled = (keepDisabled ? true : false);
                if (!isDisabled) {
                    container.removeClass('disabled');
                    container.css('opacity', '1');
                }
                this._disableEnableAll(container, isDisabled);
                $('#' + this.loadWaiting + '-please-wait').hide();
            }
        }
        this.loadWaiting = step;
    },

    gotoSection: function (section) {
        //section = $('#opc-' + section);
        //section.addClass('allow');
        //Accordion.openSection(section);
    },

    back: function () {
        if (this.loadWaiting) return;
        //Accordion.openPrevSection(true, true);
    },

    setStepResponse: function (response) {

        if (response.update_sections && response.updates.length)
        {
            for (var i = 0; i < response.updates.length; i++)
            {
                var update_item = response.updates[i];
                $('#checkout-' + update_item.name + '-load').html(update_item.html);
            }
        }

        if (response.update_section) {
            $('#checkout-' + response.update_section.name + '-load').html(response.update_section.html);
        }
        
        //TODO move it to a new method
        if ($("#billing-address-select").length > 0) {
            Billing.newAddress(!$('#billing-address-select').val());
        }
        if ($("#shipping-address-select").length > 0) {
            Shipping.newAddress(!$('#shipping-address-select').val());
        }

        if (response.goto_section) {
            Checkout.gotoSection(response.goto_section);
            return true;
        }
        if (response.redirect) {
            location.href = response.redirect;
            return true;
        }

        return false;
    }
};





var Billing = {
    form: false,
    saveUrl: false,
    disableBillingAddressCheckoutStep: true,

    init: function (form, saveUrl, disableBillingAddressCheckoutStep) {
        this.form = form;
        this.saveUrl = saveUrl;
        this.disableBillingAddressCheckoutStep = disableBillingAddressCheckoutStep;
    },

    newAddress: function (isNew) {
        if (isNew) {
            this.resetSelectedAddress();
            $('#billing-new-address-form').show();
        } else {
            $('#billing-new-address-form').hide();
        }
    },

    resetSelectedAddress: function () {
        var selectElement = $('#billing-address-select');
        if (selectElement) {
            selectElement.val('');
        }
    },

    save: function () {
        if (Checkout.loadWaiting != false) return;

        Checkout.setLoadWaiting('billing');
        
        $.ajax({
            cache: false,
            url: this.saveUrl,
            data: $(this.form).serialize(),
            type: 'post',
            success: this.nextStep,
            complete: this.resetLoadWaiting,
            error: Checkout.ajaxFailure
        });
    },

    resetLoadWaiting: function () {
        Checkout.setLoadWaiting(false);
    },

    nextStep: function (response) {
        //ensure that response.wrong_billing_address is set
        //if not set, "true" is the default value
        if (typeof response.wrong_billing_address == 'undefined') {
            response.wrong_billing_address = false;
        }
        if (Billing.disableBillingAddressCheckoutStep) {
            if (response.wrong_billing_address) {
                //Accordion.showSection('#opc-billing');
            } else {
                //Accordion.hideSection('#opc-billing');
            }
        }


        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }

            return false;
        }

        Checkout.setStepResponse(response);
    }
};



var Shipping = {
    form: false,
    saveUrl: false,
    newBtns: '#shipping-buttons-container',
    newBtn: '#shipping-new-address-btn',
    selectIput: '#shipping-address-select',

    init: function (form, saveUrl) {
        this.form = form;
        this.saveUrl = saveUrl;
        $(form).find("label").each(function () {
            var me = $(this);
            if ((me.attr("for")+"").indexOf("Address_FirstName")>=0) {
                me.text("收货人" + me.text());
            }
        });
    },

    newAddress: function (isNew) {
        if (isNew) {
            this.resetSelectedAddress();
            $(this.newBtn).hide();
            $(this.newBtns).show();
            $('#shipping-new-address-form').show();
        } else {
            $(this.newBtn).show();
            $(this.newBtns).hide();
            $('#shipping-new-address-form').hide();
        }
    },

    resetSelectedAddress: function () {
        var selectElement = $(this.selectIput);
        if (selectElement) {
            selectElement.val('');
        }
    },
    selectAddress: function (addressContainer) {
        var li = $(addressContainer);
        if (li.hasClass("selected"))
        {
            return;
        }
        li.siblings('li').removeClass("selected");
        li.addClass("selected");
        li.find("input").attr("checked", "checked");
        $(this.selectIput).val(li.attr("data-addid"));
        this.save();
    },

    cancel: function () {
        $(this.newBtn).show();
        $(this.newBtns).hide();
        $('#shipping-new-address-form').hide();
    },

    save: function () {
        if (Checkout.loadWaiting != false) return;

        Checkout.setLoadWaiting('shipping');
        
        $.ajax({
            cache: false,
            url: this.saveUrl,
            data: $(this.form).serialize(),
            type: 'post',
            success: this.nextStep,
            complete: this.resetLoadWaiting,
            error: Checkout.ajaxFailure
        });
    },

    resetLoadWaiting: function () {
        Checkout.setLoadWaiting(false);
    },

    nextStep: function (response) {
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }

            return false;
        }

        Checkout.setStepResponse(response);
    }
};



var ShippingMethod = {
    form: false,
    saveUrl: false,
    optionInput:"#shippingoption_id",

    init: function (form, saveUrl) {
        this.form = form;
        this.saveUrl = saveUrl;
    },

    validate: function() {
        if ($(this.optionInput).val().length>0) {
            return true;
        }
        alert('必须选择配送方式');
        return false;
    },
    selectMethod: function (item) {
        $(this.optionInput).val($(item).val());
        this.save();
    },
    
    save: function () {
        if (Checkout.loadWaiting != false) return;
        
        if (this.validate()) {
            Checkout.setLoadWaiting('shipping-method');
        
            $.ajax({
                cache: false,
                url: this.saveUrl,
                data: $(this.form).serialize(),
                type: 'post',
                success: this.nextStep,
                complete: this.resetLoadWaiting,
                error: Checkout.ajaxFailure
            });
        }
    },

    resetLoadWaiting: function () {
        Checkout.setLoadWaiting(false);
    },

    nextStep: function (response) {
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }

            return false;
        }

        Checkout.setStepResponse(response);
    }
};



var PaymentMethod = {
    form: false,
    saveUrl: false,
    optionInput: "#paymentmethod_id",

    init: function (form, saveUrl) {
        this.form = form;
        this.saveUrl = saveUrl;
    },

    validate: function () {
        if ($(this.optionInput).val().length > 0) {
            return true;
        }
        alert('必须选择支付方式');
        return false;
    },
    selectMethod: function (item) {
        $(this.optionInput).val($(item).val());
        this.save();
    },
    
    save: function () {
        if (Checkout.loadWaiting != false) return;
        
        if (this.validate()) {
            Checkout.setLoadWaiting('payment-method');
            $.ajax({
                cache: false,
                url: this.saveUrl,
                data: $(this.form).serialize(),
                type: 'post',
                success: this.nextStep,
                complete: this.resetLoadWaiting,
                error: Checkout.ajaxFailure
            });
        }
    },

    resetLoadWaiting: function () {
        Checkout.setLoadWaiting(false);
    },

    nextStep: function (response) {
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }

            return false;
        }

        Checkout.setStepResponse(response);
    }
};



var PaymentInfo = {
    form: false,
    saveUrl: false,

    init: function (form, saveUrl) {
        this.form = form;
        this.saveUrl = saveUrl;
    },

    save: function () {
        if (Checkout.loadWaiting != false) return;
        
        Checkout.setLoadWaiting('payment-info');
        $.ajax({
            cache: false,
            url: this.saveUrl,
            data: $(this.form).serialize(),
            type: 'post',
            success: this.nextStep,
            complete: this.resetLoadWaiting,
            error: Checkout.ajaxFailure
        });
    },

    resetLoadWaiting: function () {
        Checkout.setLoadWaiting(false);
    },

    nextStep: function (response) {
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }

            return false;
        }

        Checkout.setStepResponse(response);
    }
};



var ConfirmOrder = {
    form: false,
    saveUrl: false,
    isSuccess: false,

    init: function (saveUrl, successUrl) {
        this.saveUrl = saveUrl;
        this.successUrl = successUrl;
    },

    save: function () {
        if (Checkout.loadWaiting != false) return;
        
        //terms of service
        var termOfServiceOk = true;
        if ($('#termsofservice').length > 0) {
            //terms of service element exists
            if (!$('#termsofservice').is(':checked')) {
                $("#terms-of-service-warning-box").dialog();
                termOfServiceOk = false;
            } else {
                termOfServiceOk = true;
            }
        }
        if (termOfServiceOk) {
            Checkout.setLoadWaiting('confirm-order');
            $.ajax({
                cache: false,
                url: this.saveUrl,
                type: 'post',
                success: this.nextStep,
                complete: this.resetLoadWaiting,
                error: Checkout.ajaxFailure
            });
        } else {
            return false;
        }
    },
    
    resetLoadWaiting: function (transport) {
        Checkout.setLoadWaiting(false, ConfirmOrder.isSuccess);
    },

    nextStep: function (response) {
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }

            return false;
        }
        
        if (response.redirect) {
            ConfirmOrder.isSuccess = true;
            location.href = response.redirect;
            return;
        }
        if (response.success) {
            ConfirmOrder.isSuccess = true;
            window.location = ConfirmOrder.successUrl;
        }

        Checkout.setStepResponse(response);
    }
};