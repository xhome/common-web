/**
 * Copyright (c) 2009-2013 XHome Studio
 * Contact:  http://www.xhomestudio.org/contact.html
 *
 * Author:   jhat
 * Date:     2013-12-01
 * Email:    cpf624@126.com
 * Home:     http://pfchen.org
 * 
 * jQuery Validate扩展，依赖jQuery Validation 1.11.1
 */

// 正则表达式校验
$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "Please check your input."
);
