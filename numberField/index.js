import Field from '../field';
import template from './index.rgl';

const KEY_UP = 38;
const KEY_DOWN = 40;

/**
 * @class NumberField
 * @extend Field
 * @param {object}                  options.data                     =  绑定属性
 * @param {number=0}                options.data.value              <=> 数字输入框的值
 * @param {string=''}               options.data.size               <=> 数字输入框的尺寸
 * @param {string=''}               options.data.state              <=> 数字输入框的状态
 * @param {string=''}               options.data.tip                <=> 小贴示
 * @param {number=-Number.MAX_VALUE} options.data.min                 => 数字输入的最小值
 * @param {string}                  options.data.minTip              => 输入数字小于最小值时的提示
 * @param {number=Number.MAX_VALUE} options.data.max                 => 数字输入的最大值
 * @param {string}                  options.data.maxTip              => 输入数字大于最大值时的提示
 * @param {boolean=false}           options.data.autofocus           => 是否自动获得焦点
 * @param {string=''}               options.data.hint                => 附加提示，位于上下按钮左侧
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
const NumberField = Field.extend({
    name: 'numberField',
    template,
    /**
     * @protected
     * @override
     */
    config() {
        this.supr();
        this.defaults({
            value: 0,
            _last: null,
            step: 1,
            hint: '',
            decimalPrecision: 2,
            min: -Number.MAX_VALUE,
            max: Number.MAX_VALUE,
        });
        this._onChange();
    },
    /**
     * @method plus() 使组件中的数字按步进值增加
     * @public
     * @return {void}
     */
    plus() {
        let v = parseFloat(this.data.value);
        if (!isNaN(v)) {
            if (v >= this.data.max)
                return;

            v = v + +this.data.step;
            if (v > this.data.max)
                v = this.data.max;

            this.data.value = v;
            this._onChange();
        }
    },
    /**
     * @method minus() 使组件中的数字按步进值减少
     * @public
     * @return {void}
     */
    minus() {
        let v = parseFloat(this.data.value);
        if (!isNaN(v)) {
            if (v <= this.data.min)
                return;

            v = v - +this.data.step;
            if (v < this.data.min)
                v = this.data.min;

            this.data.value = v;
            this._onChange();
        }
    },
    /**
     * @private
     */
    _onInput(e) {
        this.$emit('input', e);
        setTimeout(() => {
            this.validate('input');
        }, 0);
        const v = parseFloat(this.data.value);
        if (v > this.data.max && this.data.maxTip)
            this.data.tip = this.data.maxTip;

        if (v < this.data.min && this.data.minTip)
            this.data.tip = this.data.minTip;

    },
    /**
     * @private
     */
    _onKeyDown(e) {
        if (e.which === KEY_UP) {
            e.stop();
            this.plus();
        } else if (e.which === KEY_DOWN) {
            e.stop();
            this.minus();
        }
    },
    /**
     * @private
     */
    _onFocus() {
        this.data.tip = '';
        this.$emit('focus', this);
    },
    /**
     * @private
     */
    _onBlur() {
        this.$emit('blur', this);
        this._onChange();
    },
    /**
     * @private
     */
    _onChange(v) {
        v = v || this.data.value;
        v = typeof v === 'number' ? v : parseFloat(v);
        if (isNaN(v))
            v = 0;

        v = parseFloat(v.toFixed(this.data.decimalPrecision));
        if (isNaN(v))
            v = 0;

        if (v > this.data.max)
            v = this.data.max;

        if (v < this.data.min)
            v = this.data.min;

        this.data.tip = '';
        this.data.value = v;
        this.$update();
        if (this.data._last === null)
            this.data._last = v;

        if (this.data._last !== v) {
            setTimeout(() => {
                /**
                 * @event change 数字文本框的值发生变化时
                 * @property {object} sender 事件发送对象
                 * @property {number} value 数字文本框的值
                 */
                this.$emit('change', {
                    sender: this,
                    value: v,
                });
                this.data._last = v;
            }, 0);
        }
    },
});

export default NumberField;
