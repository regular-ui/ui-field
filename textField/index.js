import { Component } from 'rgui-ui-base';
import { Validation } from '../validation';
import template from './index.rgl';

/**
 * @class TextField
 * @extend Component
 * @param {object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.value              <=> 文本框的值
 * @param {string=''}               options.data.state              <=> 文本框的状态
 * @param {string=''}               options.data.tip                <=> 小贴示
 * @param {object[]=[]}             options.data.rules               => 验证规则
 * @param {string=''}               options.data.placeholder         => 占位符
 * @param {number}                  options.data.maxlength           => 文本框的最大长度
 * @param {boolean=false}           options.data.autofocus           => 是否自动获得焦点
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
const TextField = Component.extend({
    name: 'textField',
    template,
    /**
     * @protected
     * @override
     */
    config() {
        this.data = Object.assign({
            // @inherited value: '',
            // @inherited state: '',
            // @inherited tip: '',
            // @inherited rules: [],
            placeholder: '',
            maxlength: undefined,
            autofocus: false,
            // _eltIE9: bowser.msie && bowser.version <= 9,
        }, this.data);
        this.supr();
    },
    /**
     * @private
     */
    _onInput($event) {
        this.validate('input');
        this.$emit('input', $event);
    },
    /**
     * @private
     */
    _onFocus($event) {
        this.$emit('focus', $event);
    },
    /**
     * @private
     */
    _onBlur($event) {
        this.validate('blur');
        this.$emit('blur', $event);
    },
});

export default TextField;
