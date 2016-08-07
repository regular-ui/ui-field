import { Component } from 'rgui-ui-base';
import template from './index.rgl';
import validator from 'validator';

/**
 * @class Validation
 * @extend Component
 * @param {object}                  options.data                     =  绑定属性
 * @param {boolean=false}           options.data.disabled            => 是否禁用。当禁用时，验证始终通过。
 */
const Validation = Component.extend({
    name: 'validation',
    template: '{#inc this.$body}',
    /**
     * @protected
     * @override
     */
    config() {
        this.fields = [];
        this.supr();
    },
    /**
     * @method validate() 验证所有表单组件
     * @public
     * @return {object} conclusion 结论
     */
    validate: function() {
        if(this.data.disabled) {
            return {
                success: true,
                message: 'Validation is disabled.',
            }
        }

        var conclusion = {
            results: [],
            success: true,
            message: '',
        };

        this.fields.forEach((field) => {
            var result = field.validate();
            conclusion.results.push(result);
            if(!result.success) {
                conclusion.success = false;
                conclusion.message = conclusion.message || result.message;
            }
        });

        return conclusion;
    },
});

Validation.validate = function(value, rules, callback) {
    let restCount = rules.length;
    const result = {
        success: true,
        message: ''
    }

    rules.forEach((rule) => rule.success = false);

    const done = function(success) {
        var rule = this;
        rule.success = success = !!success;

        if(!success) {
            result.success = false;
            result.firstRule = rule;
            // @deprecated
            result.message = rule.message;

            callback && callback(result);
        } else {
            restCount--;
            if(restCount === 0)
                callback && callback(result);
        }
    }

    for(var i = 0; i < rules.length; i++) {
        if(!result.success)
            break;

        var rule = rules[i];
        if(rule.type === 'is')
            done.call(rule, rule.options.test(value));
        else if(rule.type === 'isNot')
            done.call(rule, !rule.options.test(value));
        else if(rule.type === 'isRequired')
            done.call(rule, !!validator.toString(value));
        else if(rule.type === 'isFilled')
            done.call(rule, !!validator.toString(value).trim());
        else if(rule.type === 'async')
            rule.options && rule.options(value, done.bind(rule));
        else if(rule.type === 'method')
            done.call(rule, !!rule.options(value));
        else
            done.call(rule, validator[rule.type](value + '', rule.options));
    }
}

Validation.validator = validator;

export default Validation;
