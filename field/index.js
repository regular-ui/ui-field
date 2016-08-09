import { Component } from 'rgui-ui-base';
import Validation from '../validation';

/**
 * @class Field
 * @extend Component
 * @param {object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.value              <=> 表单域的值
 * @param {string=''}               options.data.state              <=> 表单域的状态
 * @param {string=''}               options.data.tip                <=> 小贴示
 * @param {object[]=[]}             options.data.rules               => 验证规则集
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
            _tip: '',
            rules: [],
        }, this.data);
        this.supr();

        let $outer = this.$outer;
        while ($outer) {
            if ($outer instanceof Validation) {
                $outer.fields.push(this);
                break;
            }
            $outer = $outer.$outer;
        }
    },
    /**
     * @protected
     * @override
     */
    destroy() {
        if (this.$outer && this.$outer instanceof Validation) {
            // 从$outer组件的列表中删除自己
            const index = this.$outer.fields.indexOf(this);
            ~index && this.$outer.fields.splice(index, 1);
        }
        this.supr();
    },
    /**
     * @method validate(trigger) 根据`rules`验证表单域的值是否正确
     * @public
     * @param {string='submit'} trigger 验证触发方式
     * @return {void}
     */
    validate(trigger = 'submit') {
        // const PRIORITY = {
        //     'input': 2,
        //     'blur': 1,
        //     'submit': 0,
        // };

        const value = this.data.value;
        const rules = this.data.rules.filter((rule) => (rule.trigger + '+submit').includes(trigger));
        /* if (!rules.length) {
            return this.$emit('validate', {
                sender: this,
                trigger,
                success: true,
            });
        } */

        this.data.state = 'validating';
        Validation.validate(value, rules, (result) => {
            // @TODO
            if (result.firstRule && !(result.firstRule.mute || '').includes(trigger))
                this.data._tip = result.message;
            else
                this.data._tip = '';

            this.data.state = result.success ? 'success' : 'error';
            this.$update();

            /**
             * @event validate 验证表单域时触发
             * @property {object} sender 事件发送对象
             * @property {string} trigger 验证触发方式
             * @property {boolean} success 验证是否通过
             * @property {string} message 验证不通过时的消息
             * @property {object} firstRule 第一条验证不通过的规则
             */
            this.$emit('validate', Object.assign({
                sender: this,
                trigger,
            }, result));
        });
    },
});

export default Field;
