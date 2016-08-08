import Field from '../field';
import template from './index.rgl';

/**
 * @class InputField
 * @extend Field
 * @param {object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.value              <=> 文本框的值
 * @param {string=''}               options.data.type                => 文本框的类型
 * @param {string=''}               options.data.state              <=> 文本框的状态
 * @param {string=''}               options.data.tip                <=> 小贴示
 * @param {object[]=[]}             options.data.rules               => 验证规则集
 * @param {string=''}               options.data.placeholder         => 占位符
 * @param {number}                  options.data.maxlength           => 文本框的最大长度
 * @param {boolean=false}           options.data.autofocus           => 是否自动获得焦点
 * @param {string=''}               options.data.unit                => 单位
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
const InputField = Field.extend({
    name: 'inputField',
    template,
    /**
     * @protected
     * @override
     */
    config() {
        this.data = Object.assign({
            // @inherited value: '',
            type: '',
            // @inherited state: '',
            // @inherited tip: '',
            // @inherited rules: [],
            placeholder: '',
            maxlength: undefined,
            unit: '',
            autofocus: false,
            // _eltIE9: bowser.msie && bowser.version <= 9,
        }, this.data);
        this.supr();
    },
    /**
     * @private
     */
    _onInput($event) {
        this.$emit('input', $event);
        setTimeout(() => this.validate('input'), 0);
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
        this.$emit('blur', $event);
        this.validate('blur');
    },
});

export default InputField;
