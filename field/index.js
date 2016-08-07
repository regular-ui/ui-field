import { Component } from 'rgui-ui-base';
import { Validation } from '../validation';

/**
 * @class Field
 * @extend Component
 * @param {object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.value              <=> 表单域的值
 * @param {string=''}               options.data.state              <=> 表单域的状态
 * @param {string=''}               options.data.tip                <=> 小贴示
 * @param {object[]=[]}             options.data.rules               => 验证规则
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 */
const Field = Component.extend({
    name: 'field',
    /**
     * @protected
     * @override
     */
    config() {
        this.data = Object.assign({
            value: '',
            state: '',
            tip: '',
            rules: [],
        }, this.data);
        this.supr();

        if(this.$outer && this.$outer instanceof Validation)
            this.$outer.fields.push(this);
    },
    /**
     * @protected
     * @override
     */
    destroy() {
        if(this.$outer && this.$outer instanceof Validation) {
            // 从$outer组件的列表中删除自己
            const index = this.$outer.fields.indexOf(this);
            ~index && this.$outer.fields.splice(index, 1);
        }
        this.supr();
    },
    /**
     * @method validate(trigger) 根据`rules`验证组件的值是否正确
     * @public
     * @param trigger 验证触发方式
     * @return {void}
     */
    validate(trigger = 'submit') {
        const value = this.data.value;
        const rules = this.data.rules;

        const PRIORITY = {
            'keyup': 2,
            'blur': 1,
            'submit': 0,
        }

        rules = rules.filter((rule) => rule.trigger.includes(trigger));

        Validation.validate(value, rules, this._onValidate.bind(this));
    },
    /**
     * @protected
     */
    _onValidate(result) {
        if(result.firstRule && !(typeof result.firstRule.mute === 'string' && result.firstRule.mute.includes(trigger)))
            this.data.tip = result.firstRule.message;
        else
            this.data.tip = '';

        // @TODO
        this.data.state = result.success ? '' : 'error';
        this.$update();

        this.$emit('validate', Object.assign({
            sender: this,
            trigger,
        }, result));
    },
});

export default Field;
