
if ("undefined" == typeof Foboy || !Foboy) var Foboy = {};
Foboy.namespace = function () {
    var i, j, d, a = arguments,
    o = null;
    for (i = 0; i < a.length; i += 1) for (d = ("" + a[i]).split("."), o = Foboy, j = "Foboy" == d[0] ? 1 : 0; j < d.length; j += 1) o[d[j]] = o[d[j]] || {},
    o = o[d[j]];
    return o
},
Foboy.lang = Foboy.lang || {},
function () {
    var L = Foboy.lang,
    OP = Object.prototype,
    ARRAY_TOSTRING = "[object Array]",
    FUNCTION_TOSTRING = "[object Function]",
    OBJECT_TOSTRING = "[object Object]",
    NOTHING = [],
    HTML_CHARS = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
        "`": "&#x60;"
    },
    ADD = ["toString", "valueOf"],
    OB = {
        isArray: function (o) {
            return OP.toString.apply(o) === ARRAY_TOSTRING
        },
        isBoolean: function (o) {
            return "boolean" == typeof o
        },
        isFunction: function (o) {
            return "function" == typeof o || OP.toString.apply(o) === FUNCTION_TOSTRING
        },
        isNull: function (o) {
            return null === o
        },
        isNumber: function (o) {
            return "number" == typeof o && isFinite(o)
        },
        isObject: function (o) {
            return o && ("object" == typeof o || L.isFunction(o)) || !1
        },
        isString: function (o) {
            return "string" == typeof o
        },
        isUndefined: function (o) {
            return "undefined" == typeof o
        },
        _IEEnumFix: -[1] ?
        function () { } : function (r, s) {
            var i, fname, f;
            for (i = 0; i < ADD.length; i += 1) fname = ADD[i],
            f = s[fname],
            L.isFunction(f) && f != OP[fname] && (r[fname] = f)
        },
        escapeHTML: function (html) {
            return html.replace(/[&<>"'\/`]/g,
            function (match) {
                return HTML_CHARS[match]
            })
        },
        preventDefault: function (e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = !1
        },
        extend: function (subc, superc, overrides) {
            if (!superc || !subc) throw new Error("extend failed, please check that all dependencies are included.");
            var i, F = function () { };
            if (F.prototype = superc.prototype, subc.prototype = new F, subc.prototype.constructor = subc, subc.superclass = superc.prototype, superc.prototype.constructor == OP.constructor && (superc.prototype.constructor = superc), overrides) {
                for (i in overrides) L.hasOwnProperty(overrides, i) && (subc.prototype[i] = overrides[i]);
                L._IEEnumFix(subc.prototype, overrides)
            }
        },
        augmentObject: function (r, s) {
            if (!s || !r) throw new Error("Absorb failed, verify dependencies.");
            var i, p, a = arguments,
            overrideList = a[2];
            if (overrideList && overrideList !== !0) for (i = 2; i < a.length; i += 1) r[a[i]] = s[a[i]];
            else {
                for (p in s) !overrideList && p in r || (r[p] = s[p]);
                L._IEEnumFix(r, s)
            }
            return r
        },
        augmentProto: function (r, s) {
            if (!s || !r) throw new Error("Augment failed, verify dependencies.");
            var i, a = [r.prototype, s.prototype];
            for (i = 2; i < arguments.length; i += 1) a.push(arguments[i]);
            return L.augmentObject.apply(this, a),
            r
        },
        dump: function (o, d) {
            var i, len, s = [],
            OBJ = "{...}",
            FUN = "f(){...}",
            COMMA = ", ",
            ARROW = " => ";
            if (!L.isObject(o)) return o + "";
            if (o instanceof Date || "nodeType" in o && "tagName" in o) return o;
            if (L.isFunction(o)) return FUN;
            if (d = L.isNumber(d) ? d : 3, L.isArray(o)) {
                for (s.push("["), i = 0, len = o.length; len > i; i += 1) s.push(L.isObject(o[i]) ? d > 0 ? L.dump(o[i], d - 1) : OBJ : o[i]),
                s.push(COMMA);
                s.length > 1 && s.pop(),
                s.push("]")
            } else {
                s.push("{");
                for (i in o) L.hasOwnProperty(o, i) && (s.push(i + ARROW), s.push(L.isObject(o[i]) ? d > 0 ? L.dump(o[i], d - 1) : OBJ : o[i]), s.push(COMMA));
                s.length > 1 && s.pop(),
                s.push("}")
            }
            return s.join("")
        },
        substitute: function (s, o, f, recurse) {
            for (var i, j, k, key, v, meta, token, dump, objstr, saved = [], lidx = s.length, DUMP = "dump", SPACE = " ", LBRACE = "{", RBRACE = "}"; (i = s.lastIndexOf(LBRACE, lidx), !(0 > i)) && (j = s.indexOf(RBRACE, i), !(i + 1 > j)) ;) token = s.substring(i + 1, j),
            key = token,
            meta = null,
            k = key.indexOf(SPACE),
            k > -1 && (meta = key.substring(k + 1), key = key.substring(0, k)),
            v = o[key],
            f && (v = f(key, v, meta)),
            L.isObject(v) ? L.isArray(v) ? v = L.dump(v, parseInt(meta, 10)) : (meta = meta || "", dump = meta.indexOf(DUMP), dump > -1 && (meta = meta.substring(4)), objstr = v.toString(), v = objstr === OBJECT_TOSTRING || dump > -1 ? L.dump(v, parseInt(meta, 10)) : objstr) : L.isString(v) || L.isNumber(v) || (v = "~-" + saved.length + "-~", saved[saved.length] = token),
            s = s.substring(0, i) + v + s.substring(j + 1),
            recurse === !1 && (lidx = i - 1);
            for (i = saved.length - 1; i >= 0; i -= 1) s = s.replace(new RegExp("~-" + i + "-~"), "{" + saved[i] + "}", "g");
            return s
        },
        trim: function (s) {
            try {
                return s.replace(/^\s+|\s+$/g, "")
            } catch (e) {
                return s
            }
        },
        merge: function () {
            var i, o = {},
            a = arguments,
            l = a.length;
            for (i = 0; l > i; i += 1) L.augmentObject(o, a[i], !0);
            return o
        },
        later: function (when, o, fn, data, periodic) {
            when = when || 0,
            o = o || {};
            var f, r, m = fn,
            d = data;
            if (L.isString(fn) && (m = o[fn]), !m) throw new TypeError("method undefined");
            return L.isUndefined(data) || L.isArray(d) || (d = [data]),
            f = function () {
                m.apply(o, d || NOTHING)
            },
            r = periodic ? setInterval(f, when) : setTimeout(f, when),
            {
                interval: periodic,
                cancel: function () {
                    this.interval ? clearInterval(r) : clearTimeout(r)
                }
            }
        },
        isValue: function (o) {
            return L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o)
        }
    };
    L.hasOwnProperty = OP.hasOwnProperty ?
    function (o, prop) {
        return o && o.hasOwnProperty && o.hasOwnProperty(prop)
    } : function (o, prop) {
        return !L.isUndefined(o[prop]) && o.constructor.prototype[prop] !== o[prop]
    },
    OB.augmentObject(L, OB, !0),
    L.augment = L.augmentProto,
    Foboy.augment = L.augmentProto,
    Foboy.extend = L.extend
}();; (function () {
    function parse(s, buf, offset) {
        var i = buf && offset || 0,
        ii = 0;
        for (buf = buf || [], s.toLowerCase().replace(/[0-9a-f]{2}/g,
        function (oct) {
            16 > ii && (buf[i + ii++] = _hexToByte[oct])
        }) ; 16 > ii;) buf[i + ii++] = 0;
        return buf
    }
    function unparse(buf, offset) {
        var i = offset || 0,
        bth = _byteToHex;
        return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]]
    }
    function v1(options, buf, offset) {
        var i = buf && offset || 0,
        b = buf || [];
        options = options || {};
        var clockseq = null != options.clockseq ? options.clockseq : _clockseq,
        msecs = null != options.msecs ? options.msecs : (new Date).getTime(),
        nsecs = null != options.nsecs ? options.nsecs : _lastNSecs + 1,
        dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
        if (0 > dt && null == options.clockseq && (clockseq = clockseq + 1 & 16383), (0 > dt || msecs > _lastMSecs) && null == options.nsecs && (nsecs = 0), nsecs >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
        _lastMSecs = msecs,
        _lastNSecs = nsecs,
        _clockseq = clockseq,
        msecs += 122192928e5;
        var tl = (1e4 * (268435455 & msecs) + nsecs) % 4294967296;
        b[i++] = tl >>> 24 & 255,
        b[i++] = tl >>> 16 & 255,
        b[i++] = tl >>> 8 & 255,
        b[i++] = 255 & tl;
        var tmh = msecs / 4294967296 * 1e4 & 268435455;
        b[i++] = tmh >>> 8 & 255,
        b[i++] = 255 & tmh,
        b[i++] = tmh >>> 24 & 15 | 16,
        b[i++] = tmh >>> 16 & 255,
        b[i++] = clockseq >>> 8 | 128,
        b[i++] = 255 & clockseq;
        for (var node = options.node || _nodeId,
        n = 0; 6 > n; n++) b[i + n] = node[n];
        return buf ? buf : unparse(b)
    }
    function v4(options, buf, offset) {
        var i = buf && offset || 0;
        "string" == typeof options && (buf = "binary" == options ? new BufferClass(16) : null, options = null),
        options = options || {};
        var rnds = options.random || (options.rng || _rng)();
        if (rnds[6] = 15 & rnds[6] | 64, rnds[8] = 63 & rnds[8] | 128, buf) for (var ii = 0; 16 > ii; ii++) buf[i + ii] = rnds[ii];
        return buf || unparse(rnds)
    }
    var _rng, _global = this;
    if ("function" == typeof require) try {
        var _rb = require("crypto").randomBytes;
        _rng = _rb &&
        function () {
            return _rb(16)
        }
    } catch (e) { }
    if (!_rng && _global.crypto && crypto.getRandomValues) {
        var _rnds8 = new Uint8Array(16);
        _rng = function () {
            return crypto.getRandomValues(_rnds8),
            _rnds8
        }
    }
    if (!_rng) {
        var _rnds = new Array(16);
        _rng = function () {
            for (var r, i = 0; 16 > i; i++) 0 === (3 & i) && (r = 4294967296 * Math.random()),
            _rnds[i] = r >>> ((3 & i) << 3) & 255;
            return _rnds
        }
    }
    for (var BufferClass = "function" == typeof Buffer ? Buffer : Array, _byteToHex = [], _hexToByte = {},
    i = 0; 256 > i; i++) _byteToHex[i] = (i + 256).toString(16).substr(1),
    _hexToByte[_byteToHex[i]] = i;
    var _seedBytes = _rng(),
    _nodeId = [1 | _seedBytes[0], _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]],
    _clockseq = 16383 & (_seedBytes[6] << 8 | _seedBytes[7]),
    _lastMSecs = 0,
    _lastNSecs = 0,
    uuid = v4;
    if (uuid.v1 = v1, uuid.v4 = v4, uuid.parse = parse, uuid.unparse = unparse, uuid.BufferClass = BufferClass, _global.define && define.amd) define(function () {
        return uuid
    });
    else if ("undefined" != typeof module && module.exports) module.exports = uuid;
    else {
        var _previousRoot = _global.uuid;
        uuid.noConflict = function () {
            return _global.uuid = _previousRoot,
            uuid
        },
        _global.uuid = uuid
    }
}).call(this);;
Foboy.namespace("app.updateMiniCart, app.addShopCart, app.addShopCartEvent"),
Foboy.app.updateMiniCart = function () {
},
Foboy.app.addShopCart = function (gid, callback, obj) {
    if (gid && "function" == typeof callback) {
        var ajaxUrl = Foboy.GLOBAL_CONFIG.orderSite + "/cart/add/" + gid;
        $.ajax({
            url: ajaxUrl,
            dataType: "jsonp",
            jsonp: "jsonpcallback",
            success: function (data) {
                callback(data, obj),
                Foboy.app.updateMiniCart()
            }
        })
    }
},
Foboy.app.addShopCartEvent = function (options) {
    var op = {
        obj: ".xmAddShopCart",
        callback: null
    };
    $.extend(op, options || {}),
    $(document).on("click", op.obj,
    function () {
        var gid = $(this).attr("data-gid"),
        isDisabled = $(this).attr("data-disabled"),
        isPackage = $(this).attr("data-package");
        if ("false" === isDisabled) {
            if ($(this).attr("data-disabled", "true"), !gid || "true" === isPackage || null === op.callback) return !0;
            var dmSkuArr = Foboy.GLOBAL_CONFIG.damiaoGoodsId ? Foboy.GLOBAL_CONFIG.damiaoGoodsId : !1,
            isToDm = !1;
            if (dmSkuArr !== !1 && "object" == typeof dmSkuArr) for (var i = 0; i < dmSkuArr.length; i += 1) if (gid === dmSkuArr[i]) {
                isToDm = !0;
                break
            }
            if (isToDm === !0) {
                var dmLogin = new Foboy.app.miniLogin;
                Foboy.app.cookie("serviceToken") ? Foboy.app.dmFun.init({
                    sku: gid,
                    callback: op.callback,
                    obj: $(this)
                }) : Foboy.app.cookie("userId") ? (dmLogin._proxyiframe(), Foboy.app.dmFun.init({
                    sku: gid,
                    callback: op.callback,
                    obj: $(this)
                })) : dmLogin._toLogin()
            } else Foboy.app.addShopCart(gid, op.callback, $(this))
        }
        return !1
    })
},
function () {
    for (var method, noop = function () { },
    methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"], length = methods.length, console = window.console = window.console || {}; length--;) method = methods[length],
    console[method] || (console[method] = noop)
}(),

Foboy.namespace("app.miniCart"),
Foboy.app.miniCart = {
    elmCartBtn: $("#J_miniCart"),
    elmCartList: $("#J_miniCartList"),
    loadingStr: '<p class="loading">数据加载中，请稍后...</p>',
    speed: 500,
    init: function () {
        var _this = this,
        timeOut = null;
        return "undefined" != typeof miniCartDisable && miniCartDisable ? !1 : (_this.elmCartBtn.on({
            mouseenter: function () {
                clearTimeout(timeOut),
                $(this).hasClass("mini-cart-on") || ($(this).addClass("mini-cart-on"), _this.show())
            },
            mouseleave: function () {
                timeOut = setTimeout(function () {
                    _this.close()
                },
                _this.speed)
            }
        }), _this.elmCartList.on({
            mouseenter: function () {
                clearTimeout(timeOut)
            },
            mouseleave: function () {
                timeOut = setTimeout(function () {
                    _this.close()
                },
                _this.speed)
            }
        }))
    },
    show: function () {
        var _this = this;
        _this.elmCartList.show()
    },
    close: function () {
        var _this = this;
        _this.elmCartBtn.removeClass("mini-cart-on"),
        _this.elmCartList.hide()
    }
},

Foboy.namespace("app.navMenus, app.navigation"),
Foboy.app.navMenus = function () {
    function toggleMenu(elm, curIndex, show, opt) {
        var options, $menu, $elm = $(elm);
        return options = $.extend({},
        defaults, opt),
        $menu = $elm.children(options.menuSelector),
        "toggle" === options.effect ? show ? $menu.removeClass("current").children(options.submenuSelector).hide().end().eq(curIndex).addClass("current").children(options.submenuSelector).show() : $menu.removeClass("current").children(options.submenuSelector).hide() : "slide" === options.effect ? show ? ($menu.removeClass("current").children(options.submenuSelector).stop(!0, !0).delay(options.speed).slideUp(options.speed), $menu.eq(curIndex).addClass("current").children(options.submenuSelector).stop(!0, !0).slideDown(options.speed)) : $menu.removeClass("current").children(options.submenuSelector).stop(!0, !0).slideUp(options.speed) : "fade" === options.effect && (show ? ($menu.removeClass("current").children(options.submenuSelector).stop(!0, !0).fadeOut(options.speed), $menu.eq(curIndex).children(options.submenuSelector).stop(!0, !0).fadeIn(options.speed)) : $menu.removeClass("current").children(options.submenuSelector).stop(!0, !0).fadeOut(options.speed)),
        $menu.eq(curIndex).children(options.submenuSelector)
    }
    function init(elm, opt) {
        function bindToggleEvent(curIndex, show) {
            options.delay > 0 && "click" !== options.triggerEvent ? show ? (timeoutToggle && window.clearTimeout(timeoutToggle), timeoutToggle = window.setTimeout(function () {
                toggleMenu($elm, curIndex, !0, options)
            },
            options.delay)) : (window.clearTimeout(timeoutToggle), timeoutToggle = window.setTimeout(function () {
                toggleMenu($elm, curIndex, !1, options)
            },
            options.delay)) : show ? toggleMenu($elm, curIndex, !0, options) : toggleMenu($elm, curIndex, !1, options),
            "function" == typeof options.callback && options.callback($elm, curIndex, options)
        }
        var options, $menu, timeoutToggle, $elm = $(elm);
        return 0 === $elm.length ? $elm : $elm.length > 1 ? ($elm.each(function () {
            init($(this), opt)
        }), this) : (options = $.extend({},
        defaults, opt), $menu = $elm.children(options.menuSelector), "hover" === options.triggerEvent ? $menu.on({
            mouseenter: function () {
                bindToggleEvent($menu.index($(this)), !0)
            },
            mouseleave: function () {
                bindToggleEvent($menu.index($(this)), !1)
            }
        }) : "click" === options.triggerEvent && $menu.on("click",
        function (e) {
            e.preventDefault(),
            $(this).hasClass("toggled") ? ($(this).removeClass("toggled"), bindToggleEvent($menu.index($(this)), !1)) : ($menu.removeClass("toggled"), $(this).addClass("toggled"), bindToggleEvent($menu.index($(this)), !0))
        }), void (window.ActiveXObject && !window.XMLHttpRequest && $menu.find(options.submenuSelector).find("a").on("click",
        function () {
            window.location.href = $(this).attr("href")
        })))
    }
    var defaults;
    return defaults = {
        menuSelector: ".menu",
        submenuSelector: ".children",
        triggerEvent: "hover",
        effect: "toggle",
        delay: 200,
        speed: 200,
        callback: function () { }
    },
    {
        toggleMenu: toggleMenu,
        init: init
    }
}(),
Foboy.app.navCategory = function () {
    function toggleCategoryList(option) {
        "show" === option ? ($categoryContainer.addClass("nav-category-toggled"), $categoryTriggerBtn.find(".iconfont").html("&#xf02aa;"), $categoryList.show()) : "static" === option ? ($categoryContainer.addClass("nav-category-toggled"), $categoryList.show()) : ($categoryContainer.removeClass("nav-category-toggled"), $categoryTriggerBtn.find(".iconfont").html("&#xf02a9;"), $categoryList.hide().find(".nav-category-list").children("li").removeClass("current"))
    }
    function bindChildrenList() {
        var timeoutChildrenList;
        $categoryList.find(".nav-category-list").children("li").on({
            mouseenter: function () {
                var $this = $(this);
                window.clearTimeout(timeoutChildrenList),
                $this.hasClass("current") || (timeoutChildrenList = window.setTimeout(function () {
                    $this.addClass("current").siblings("li").removeClass("current");
                    var $children = $this.find(".nav-category-children");
                    if ($children.length && $children.offset().top - $categoryContainer.offset().top - $categoryContainer.height() + $children.height() > $categoryList.height()) {
                        var bottomFix = $children.offset().top - $categoryContainer.offset().top - $categoryContainer.height() + 73 - $categoryList.height();
                        $children.css({
                            top: "auto",
                            bottom: bottomFix
                        })
                    }
                },
                100))
            },
            mouseleave: function () {
                var $this = $(this);
                window.clearTimeout(timeoutChildrenList),
                $this.hasClass("current") && (timeoutChildrenList = window.setTimeout(function () {
                    $this.removeClass("current")
                },
                100))
            }
        })
    }
    function init() {
        function addSrcset(elm) {
            var $imgs = elm.find("img");
            $imgs.each(function () {
                if (/40x40/.test($(this).attr("src"))) {
                    var url2x = $(this).attr("src").replace("40x40", "80x80");
                    $(this).attr("srcset", url2x + " 2x")
                }
            })
        }
        var isCategoryStatic = "undefined" != typeof isCategoryToggled ? isCategoryToggled : !1;
        if (false, addSrcset($(".nav-category-list")), isCategoryStatic) toggleCategoryList("static");
        else {
            $categoryTriggerBtn.append('<i class="iconfont">&#xf02a9;</i>');
            var timeoutCategory;
            $categoryContainer.on({
                mouseenter: function () {
                    window.clearTimeout(timeoutCategory),
                    $(this).hasClass("nav-category-toggled") || (timeoutCategory = window.setTimeout(function () {
                        toggleCategoryList("show")
                    },
                    200))
                },
                mouseleave: function () {
                    window.clearTimeout(timeoutCategory),
                    $(this).hasClass("nav-category-toggled") && (timeoutCategory = window.setTimeout(function () {
                        toggleCategoryList("hide")
                    },
                    200))
                }
            })
        }
        bindChildrenList()
    }
    var $categoryContainer = $("#J_categoryContainer"),
    $categoryTriggerBtn = $categoryContainer.children(".btn-category-list"),
    $categoryList = $categoryContainer.children(".nav-category-section");
    return {
        init: init
    }
}(),
Foboy.namespace("app.placeholder"),
Foboy.app.placeholder = function (el, opt) {
    var defaults, options, elmPlaceholder, elm = $(el),
    isPlaceholderSupported = "placeholder" in document.createElement("input");
    return 0 === elm.length ? elm : elm.length > 1 ? (elm.each(function () {
        Foboy.app.placeholder($(this), opt)
    }), this) : (defaults = {
        blurClass: "xm-ph-blur"
    },
    options = $.extend({},
    defaults, opt), elmPlaceholder = elm.attr("placeholder"), void (!isPlaceholderSupported && elmPlaceholder && (elm.is("textarea") ? "" === elm.html() && elm.addClass(options.blurClass).html(elmPlaceholder) : "" === elm.val() && elm.addClass(options.blurClass).val(elmPlaceholder), elm.on({
        focus: function () {
            $(this).is("textarea") ? $(this).html() === elmPlaceholder && $(this).removeClass(options.blurClass).html("") : $(this).val() === elmPlaceholder && $(this).removeClass(options.blurClass).val("")
        },
        blur: function () {
            $(this).is("textarea") ? "" === $(this).html() && $(this).addClass(options.blurClass).html(elmPlaceholder) : "" === $(this).val() && $(this).addClass(options.blurClass).val(elmPlaceholder)
        }
    }))))
},
Foboy.namespace("app.carousel"),
Foboy.app.carousel = function () {
    function init(elm, opt) {
        function slideList(targetPage) {
            var offsetX = "-" + targetPage * itemWidth * itemPerSlide + "px";
            $list.animate({
                "margin-left": offsetX
            },
            options.speed),
            targetPage > 0 && countPage - 1 > targetPage ? ($btnPrev.removeClass("page-btn-prev-disabled"), $btnNext.removeClass("page-btn-next-disabled")) : 0 === targetPage ? ($btnPrev.addClass("page-btn-prev-disabled"), $btnNext.removeClass("page-btn-next-disabled")) : targetPage === countPage - 1 && ($btnPrev.removeClass("page-btn-prev-disabled"), $btnNext.addClass("page-btn-next-disabled"))
        }
        function autoPlay() {
            return 0 >= countPage ? !1 : void (timeoutAuto = setInterval(function () {
                curIndex += 1,
                curIndex > countPage - 1 && (curIndex = 0),
                slideList(curIndex)
            },
            options.delay))
        }
        var options, $listWrap, $list, $btnPrev, $btnNext, itemLength, itemWidth, itemHeight, itemPerSlide, countPage, timeoutAuto, $elm = $(elm),
        curIndex = 0;
        return 0 === $elm.length ? $elm : $elm.length > 1 ? ($elm.each(function () {
            init($(this), opt)
        }), this) : (options = $.extend({},
        defaults, opt), $listWrap = $elm.find(options.listWrapSelector), $list = $listWrap.find(options.listSelector), $btnPrev = $elm.find(options.prevBtnSelector), $btnNext = $elm.find(options.nextBtnSelector), itemWidth = options.itemWidth || $list.children(options.itemSelector).outerWidth(), itemHeight = options.itemHeight || $list.children(options.itemSelector).outerHeight() - 1, itemLength = $list.children(options.itemSelector).length, itemPerSlide = 4 !== itemLength ? Math.ceil($listWrap.width() / itemWidth) : 4, countPage = Math.ceil(itemLength / itemPerSlide), 1 === countPage && ($btnPrev.hide(), $btnNext.hide()), $listWrap.css({
            height: itemHeight
        }), $list.css({
            width: itemWidth * itemLength,
            "margin-left": 0
        }), $btnPrev.addClass("page-btn-prev-disabled"), 1 >= countPage && $btnNext.addClass("page-btn-next-disabled"), options.autoPlay && (autoPlay(), $elm.on({
            mouseenter: function () {
                timeoutAuto && clearInterval(timeoutAuto)
            },
            mouseleave: function () {
                autoPlay()
            }
        })), $btnPrev.on("click",
        function (e) {
            e.preventDefault(),
            $(this).hasClass("page-btn-prev-disabled") || (curIndex -= 1, 0 >= curIndex && (curIndex = 0, $(this).addClass("page-btn-prev-disabled")), $btnNext.removeClass("page-btn-next-disabled"), slideList(curIndex))
        }), void $btnNext.on("click",
        function (e) {
            e.preventDefault(),
            $(this).hasClass("page-btn-next-disabled") || (curIndex += 1, curIndex > countPage - 1 && (curIndex = countPage - 1, $(this).addClass("page-btn-next-disabled")), $btnPrev.removeClass("page-btn-prev-disabled"), slideList(curIndex))
        }))
    }
    var defaults;
    return defaults = {
        listWrapSelector: ".J_carouselWrap",
        listSelector: ".J_carouselList",
        itemSelector: "li",
        prevBtnSelector: ".J_carouselPrev",
        nextBtnSelector: ".J_carouselNext",
        itemWidth: null,
        itemHeight: null,
        autoPlay: !0,
        speed: 500,
        delay: 5e3
    },
    {
        init: init
    }
}(),

+
function ($) {
    "use strict";
    function transitionEnd() {
        var el = document.createElement("bootstrap"),
        transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var name in transEndEventNames) if (void 0 !== el.style[name]) return {
            end: transEndEventNames[name]
        };
        return !1
    }
    $.fn.emulateTransitionEnd = function (duration) {
        var called = !1,
        $el = this;
        $(this).one($.support.transition.end,
        function () {
            called = !0
        });
        var callback = function () {
            called || $($el).trigger($.support.transition.end)
        };
        return setTimeout(callback, duration),
        this
    },
    $(function () {
        $.support.transition = transitionEnd()
    })
}(jQuery);; !
function ($) {
    "use strict";
    var Modal = function (element, options) {
        this.options = options,
        this.$element = $(element).delegate('[data-dismiss="modal"]', "click.dismiss.modal", $.proxy(this.hide, this)),
        this.options.remote && this.$element.find(".modal-body").load(this.options.remote)
    };
    Modal.prototype = {
        constructor: Modal,
        toggle: function () {
            return this[this.isShown ? "hide" : "show"]()
        },
        show: function () {
            var that = this,
            e = $.Event("show");
            this.$element.trigger(e),
            this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.backdrop(function () {
                var transition = $.support.transition && that.$element.hasClass("fade");
                that.$element.parent().length || that.$element.appendTo(document.body),
                that.$element.show(),
                transition && that.$element[0].offsetWidth,
                that.$element.addClass("in").attr("aria-hidden", !1),
                that.enforceFocus(),
                transition ? that.$element.one($.support.transition.end,
                function () {
                    that.$element.focus().trigger("shown")
                }) : that.$element.focus().trigger("shown")
            }))
        },
        hide: function (e) {
            e && e.preventDefault();
            e = $.Event("hide"),
            this.$element.trigger(e),
            this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), $(document).off("focusin.modal"), this.$element.removeClass("in").attr("aria-hidden", !0), $.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal())
        },
        enforceFocus: function () {
            var that = this;
            $(document).on("focusin.modal",
            function (e) {
                that.$element[0] === e.target || that.$element.has(e.target).length || that.$element.focus()
            })
        },
        escape: function () {
            var that = this;
            this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.modal",
            function (e) {
                27 == e.which && that.hide()
            }) : this.isShown || this.$element.off("keyup.dismiss.modal")
        },
        hideWithTransition: function () {
            var that = this,
            timeout = setTimeout(function () {
                that.$element.off($.support.transition.end),
                that.hideModal()
            },
            500);
            this.$element.one($.support.transition.end,
            function () {
                clearTimeout(timeout),
                that.hideModal()
            })
        },
        hideModal: function () {
            var that = this;
            this.$element.hide(),
            this.backdrop(function () {
                that.removeBackdrop(),
                that.$element.trigger("hidden")
            })
        },
        removeBackdrop: function () {
            this.$backdrop && this.$backdrop.remove(),
            this.$backdrop = null
        },
        backdrop: function (callback) {
            var animate = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var doAnimate = $.support.transition && animate,
                pageHeight = $(document).height(),
                pageWidth = "100%";
                if (this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body), this.$backdrop.css({
                    width: pageWidth,
                    height: pageHeight
                }).click("static" == this.options.backdrop ? $.proxy(this.$element[0].focus, this.$element[0]) : $.proxy(this.hide, this)), doAnimate && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !callback) return;
                doAnimate ? this.$backdrop.one($.support.transition.end, callback) : callback()
            } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one($.support.transition.end, callback) : callback()) : callback && callback()
        }
    };
    var old = $.fn.modal;
    $.fn.modal = function (option) {
        return this.each(function () {
            var $this = $(this),
            data = $this.data("modal"),
            options = $.extend({},
            $.fn.modal.defaults, $this.data(), "object" == typeof option && option);
            data || $this.data("modal", data = new Modal(this, options)),
            "string" == typeof option ? data[option]() : options.show && data.show()
        })
    },
    $.fn.modal.defaults = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    },
    $.fn.modal.Constructor = Modal,
    $.fn.modal.noConflict = function () {
        return $.fn.modal = old,
        this
    },
    $(document).on("click.modal.data-api", '[data-toggle="modal"]',
    function (e) {
        var $this = $(this),
        href = $this.attr("href"),
        $target = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, "")),
        option = $target.data("modal") ? "toggle" : $.extend({
            remote: !/#/.test(href) && href
        },
        $target.data(), $this.data());
        e.preventDefault(),
        $target.modal(option).one("hide",
        function () {
            $this.focus()
        })
    })
}(window.jQuery);; !
function () {
    "use strict";
    function encodeHTMLSource() {
        var encodeHTMLRules = {
            "&": "&#38;",
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "/": "&#47;"
        },
        matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
        return function () {
            return this ? this.replace(matchHTML,
            function (m) {
                return encodeHTMLRules[m] || m
            }) : this
        }
    }
    function resolveDefs(c, block, def) {
        return ("string" == typeof block ? block : block.toString()).replace(c.define || skip,
        function (m, code, assign, value) {
            return 0 === code.indexOf("def.") && (code = code.substring(4)),
            code in def || (":" === assign ? (c.defineParams && value.replace(c.defineParams,
            function (m, param, v) {
                def[code] = {
                    arg: param,
                    text: v
                }
            }), code in def || (def[code] = value)) : new Function("def", "def['" + code + "']=" + value)(def)),
            ""
        }).replace(c.use || skip,
        function (m, code) {
            c.useParams && (code = code.replace(c.useParams,
            function (m, s, d, param) {
                if (def[d] && def[d].arg && param) {
                    var rw = (d + ":" + param).replace(/'|\\/g, "_");
                    return def.__exp = def.__exp || {},
                    def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2"),
                    s + "def.__exp['" + rw + "']"
                }
            }));
            var v = new Function("def", "return " + code)(def);
            return v ? resolveDefs(c, v, def) : v
        })
    }
    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ")
    }
    var global, doT = {
        version: "1.0.0",
        templateSettings: {
            evaluate: /\{\{([\s\S]+?\}?)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode: /\{\{!([\s\S]+?)\}\}/g,
            use: /\{\{#([\s\S]+?)\}\}/g,
            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            defineParams: /^\s*([\w$]+):([\s\S]+)/,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname: "it",
            strip: !0,
            append: !0,
            selfcontained: !1
        },
        template: void 0,
        compile: void 0
    };
    "undefined" != typeof module && module.exports ? module.exports = doT : "function" == typeof define && define.amd ? define(function () {
        return doT
    }) : (global = function () {
        return this || (0, eval)("this")
    }(), global.doT = doT),
    String.prototype.encodeHTML = encodeHTMLSource();
    var startend = {
        append: {
            start: "'+(",
            end: ")+'",
            endencode: "||'').toString().encodeHTML()+'"
        },
        split: {
            start: "';out+=(",
            end: ");out+='",
            endencode: "||'').toString().encodeHTML();out+='"
        }
    },
    skip = /$^/;
    doT.template = function (tmpl, c, def) {
        c = c || doT.templateSettings;
        var needhtmlencode, indv, cse = c.append ? startend.append : startend.split,
        sid = 0,
        str = c.use || c.define ? resolveDefs(c, tmpl, def || {}) : tmpl;
        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str).replace(/'|\\/g, "\\$&").replace(c.interpolate || skip,
        function (m, code) {
            return cse.start + unescape(code) + cse.end
        }).replace(c.encode || skip,
        function (m, code) {
            return needhtmlencode = !0,
            cse.start + unescape(code) + cse.endencode
        }).replace(c.conditional || skip,
        function (m, elsecase, code) {
            return elsecase ? code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='" : code ? "';if(" + unescape(code) + "){out+='" : "';}out+='"
        }).replace(c.iterate || skip,
        function (m, iterate, vname, iname) {
            return iterate ? (sid += 1, indv = iname || "i" + sid, iterate = unescape(iterate), "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){" + vname + "=arr" + sid + "[" + indv + "+=1];out+='") : "';} } out+='"
        }).replace(c.evaluate || skip,
        function (m, code) {
            return "';" + unescape(code) + "out+='"
        }) + "';return out;").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/(\s|;|\}|^|\{)out\+='';/g, "$1").replace(/\+''/g, "").replace(/(\s|;|\}|^|\{)out\+=''\+/g, "$1out+="),
        needhtmlencode && c.selfcontained && (str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str);
        try {
            return new Function(c.varname, str)
        } catch (e) {
            throw "undefined" != typeof console && console.log("Could not create a template function: " + str),
            e
        }
    },
    doT.compile = function (tmpl, def) {
        return doT.template(tmpl, null, def)
    }
}();