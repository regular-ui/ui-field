import { Component } from 'rgui-ui-base';
import validator from 'validator';
import '../util';

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
     * @method validate() 验证所有内部的表单域
     * @public
     * @return {object} conclusion 结论
     */
    validate() {
        if (this.data.disabled) {
            return {
                success: true,
                message: 'Validation is disabled.',
            };
        }

        const conclusion = {
            results: [],
            success: true,
            message: '',
        };

        let restCount = this.fields.length;
        const done = function (result) {
            delete result.sender;
            conclusion.results.push(result);
            if (!result.success) {
                conclusion.success = false;
                conclusion.message = conclusion.message || result.message;
            }

            restCount--;
            if (restCount === 0) {
                /**
                 * @event validate 验证表单时触发
                 * @property {object} sender 事件发送对象
                 * @property {boolean} success 验证是否通过
                 * @property {string} message 验证不通过时的消息
                 * @property {object} results 每个表单域的结果
                 */
                this.$emit('validate', Object.assign({
                    sender: this,
                }, conclusion));
            }
        };

        this.fields.forEach((field) =>
            field.$one('validate', done.bind(this)).validate());

        return conclusion;
    },
});

/**
 * @method validate(value,rules,callback) 根据规则验证单个值
 * @static
 * @public
 * @param {var} value 待验证的值，会自动转为string类型
 * @param {var} value 验证规则集
 * @callback {object} result 验证结果
 * @callback {boolean} result.success 验证是否正确
 * @callback {string} result.message 验证不通过时的消息
 * @callback {object} result.firstRule 第一条验证不通过的规则
 */
Validation.validate = function (value, rules, callback) {
    const result = {
        success: true,
        message: '',
    };

    value = validator.toString(value);
    rules.forEach((rule) => rule.success = false);

    let restCount = rules.length;
    const done = function (success) {
        const rule = this;
        rule.success = success = !!success;

        if (!success) {
            result.success = false;
            result.firstRule = rule;
            result.message = rule.message;

            callback && callback(result);
        } else {
            restCount--;
            if (restCount === 0)
                callback && callback(result);
        }
    };

    for (let i = 0; i < rules.length; i++) {
        if (!result.success)
            break;

        const rule = rules[i];
        if (rule.type === 'is')
            done.call(rule, rule.options.test(value));
        else if (rule.type === 'isNot')
            done.call(rule, !rule.options.test(value));
        else if (rule.type === 'isRequired')
            done.call(rule, !!value);
        else if (rule.type === 'isFilled')
            done.call(rule, !!value.trim());
        else if (rule.type === 'method')
            done.call(rule, !!rule.options(value));
        else if (rule.type === 'async')
            rule.options && rule.options(value, done.bind(rule));
        else
            done.call(rule, validator[rule.type](value, rule.options));
    }
};

Validation.validator = validator;

export default Validation;
