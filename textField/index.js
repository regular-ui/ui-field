import Field from '../field';
import template from './index.rgl';

/**
 * @class TextField
 * @extend Field
 * @param {object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.value              <=> 文本框的值
 * @param {string=''}               options.data.size               <=> 文本框的尺寸
 * @param {string=''}               options.data.state              <=> 文本框的状态
 * @param {string=''}               options.data.tip                <=> 小贴示
 * @param {object[]=[]}             options.data.rules               => 验证规则集
 * @param {string=''}               options.data.placeholder         => 文本框的占位文字
 * @param {number}                  options.data.maxlength           => 文本框的最大长度
 * @param {boolean=false}           options.data.autofocus           => 是否自动获得焦点
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
const TextField = Field.extend({
    name: 'textField',
    template,
    /**
     * @protected
     * @override
     */
    config() {
        this.defaults({
            // @inherited value: '',
            // @inherited state: '',
            // @inherited tip: '',
            // @inherited _tip: '',
            // @inherited rules: [],
            placeholder: '',
            maxlength: undefined,
            autofocus: false,
            // _eltIE9: bowser.msie && bowser.version <= 9,
        });
        this.supr();
    },
    /**
     * @method focus() 使组件获得焦点
     * @public
     * @return {void}
     */
    focus() {this.$refs.textarea.focus();},
    /**
     * @method blur() 使组件失去焦点
     * @public
     * @return {void}
     */
    blur() {this.$refs.textarea.blur();},
    /**
     * @private
     */
    _onInput($event) {
        this.validate('input');
        setTimeout(() => this.validate('input'), 0);
    },
    /**
     * @private
     */
    _onFocus($event) {
        this.data.state = '';
        this.data._tip = this.data.tip;
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
