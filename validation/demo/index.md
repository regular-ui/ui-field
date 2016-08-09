表单验证在网页中是一种很常见却不简单的交互流程。随着前端的发展，这种流程变得越来越复杂多样，传统的表单处理逻辑已经无法很好的满足交互需求。Regular UI为了解决这种问题，实现了一套创新性的表单验证体系。

## 验证规则

许多经典的框架或类库会把某个表单控件的验证行为抽象成类似这样的结构：

```javascript
{required:  ..., type:  ..., min:  ..., max: ..., pattern: ..., extend: ...}
```

这使得表单验证时按照固定的字段和顺序来处理，并且同一条规则不能重复使用，大大降低了验证逻辑的灵活性。

### 有序规则集

在Regular UI中，每个表单域`field`组件的验证行为由一个有序列表——规则集`rules`来处理，每个规则集包含若干条验证规则`rule`，结构如下：

```javascript
[{type: 'isRequired', ...}, {type: 'is', ...}, {type: 'isInt', ...}, ...]
```

每条规则仅包括4个参数：

- `type`：验证类型
- `trigger`：触发方式
- `message`：验证不通过时的消息
- `options`：关于验证类型的一些选项

下面举个例子，一个用户名输入框的验证包含以下规则：

1. 以字母开头，实时验证
2. 字母、数字或中划线组成，实时验证
3. 以字母或数字结尾，实时验证
4. 必须输入用户名，失焦验证
5. 4~12个字符，失焦验证

<div class="m-example"></div>

```xml
<form class="m-form">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: [
            { type: 'isNot', trigger: 'input+blur', message: '以字母开头', options: /^[^a-zA-Z]/ },
            { type: 'isNot', trigger: 'input+blur', message: '字母、数字或中划线组成', options: /[^a-zA-Z0-9-]/ },
            { type: 'isNot', trigger: 'blur', message: '以字母或数字结尾', options: /[^a-zA-Z0-9]$/ },
            { type: 'isRequired', trigger: 'blur', message: '请输入用户名' },
            { type: 'isLength', trigger: 'blur', message: '不得少于4个字符', options: { min: 4 } },
        ],
    },
});
```

### 规则类型

- 当类型为`isRequired`时，表示该值不能为空
- 当类型为`isFilled`时，表示该值去除首尾空白字符，即`trim`之后也不能为空
- 当类型为`is`时，需要给`options`传一个正则表达式，根据此正则表达式来验证该值
- 当类型为`isNot`时，与`is`同理，只是验证结果为正则表达式的否定值
- 当类型为`method`时，需要给`options`传一个同步方法，通过这个方法来验证该值
- 当类型为`async`时，需要给`options`传一个异步方法，同时异步方法中需要调用`done`回调函数，通过这个过程来验证该值

其它规则如`isLength`, `isInt`, `isURL`, ...，请参见[validator](https://www.npmjs.com/package/validator)。

示例如下：

<div class="m-example"></div>

```xml
<form class="m-form">
    <div class="form_item">
        <label class="form_label">isRequired<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[0]} maxlength=12 placeholder="试一试什么都不要输入" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">isFilled<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[1]} maxlength=12 placeholder="试一试输入空格" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">is：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[2]} maxlength=12 placeholder="以数字开头" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">isNot：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[3]} maxlength=12 placeholder="不能以数字开头" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">method：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[4]} maxlength=12 placeholder="验证码为6543" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">async：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[5]} maxlength=12 placeholder="用户名user已被使用" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">isLength：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[6]} maxlength=12 placeholder="4~8个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">isEmail：</label>
        <span class="form_field">
            <inputField size="lgw" rules={rules[7]} maxlength=12 placeholder="输入一个电子邮箱" />
        </span>
    </div>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: [
            [{ type: 'isRequired', trigger: 'input+blur', message: '该值不能为空' }],
            [{ type: 'isFilled', trigger: 'input+blur', message: '该值不能为空' }],
            [{ type: 'is', trigger: 'input+blur', message: '以数字开头', options: /^\d/ }],
            [{ type: 'isNot', trigger: 'input+blur', message: '不能以数字开头', options: /^\d/ }],
            [{ type: 'method', trigger: 'input+blur', message: '请输入正确的验证码', options: (value) => value === '6543' }],
            [{ type: 'async', trigger: 'input+blur', message: '该用户名已被使用', options: (value, done) => {
                setTimeout(() => done(value !== 'user'), 100);
            } }],
            [{ type: 'isLength', trigger: 'input+blur', message: '4~8个字符', options: { min: 4, max: 8 } }],
            [{ type: 'isEmail', trigger: 'input+blur', message: '请输入正确的电子邮箱' }],
        ],
    },
});
```

### 触发方式

表单验证行为按照实时性通常可以分为三种：提交验证、失焦验证、实时验证，分别对应验证规则`trigger`的三种触发方式：`submit`, `blur`, `input`，规则中默认为`submit`。

另外还有一种行为叫表单限制，不属于表单验证，但通常与之配合使用。

#### 提交验证

点击表单提交按钮时才对表单中所有控件进行验证，通常对应submit按钮的`click`事件。示例如下：

<div class="m-example"></div>

```xml
<form class="m-form">
<validation ref="validation">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.name} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">邮箱<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.email} maxlength=20 placeholder="请输入邮箱" />
        </span>
    </div>
    <div class="form_item">
        <span class="form_field"><a class="u-btn u-btn-primary" on-click={this.submit()}>提交</a></span>
    </div>
</validation>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: {
            name: [
                { type: 'isFilled', message: '请输入用户名！' },
                { type: 'isLength', message: '请输入4~12个字符！', options: { min: 4, max: 12 } },
            ],
            email: [
                { type: 'isFilled', message: '请输入邮箱！' },
                { type: 'isEmail', message: '邮箱格式不正确！' },
            ],
        },
    },
    submit() {
        this.$refs.validation.$one('validate', (conclusion) => {
            if(conclusion.success)
                alert('提交成功！');
        }).validate();
    },
});
```

#### 失焦验证

在表单控件失去焦点时对该控件进行验证，通常对应表单控件的`blur`事件。示例如下：

<div class="m-example"></div>

```xml
<form class="m-form">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.name} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">邮箱<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.email} maxlength=20 placeholder="请输入邮箱" />
        </span>
    </div>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: {
            name: [
                { type: 'isFilled', trigger: 'blur', message: '请输入用户名！' },
                { type: 'isLength', trigger: 'blur', message: '请输入4~12个字符！', options: { min: 4, max: 12 } },
            ],
            email: [
                { type: 'isFilled', trigger: 'blur', message: '请输入邮箱！' },
                { type: 'isEmail', trigger: 'blur', message: '邮箱格式不正确！' },
            ],
        },
    },
});
```

#### 实时验证

在表单控件的值实时改变时，对该控件进行验证，通常对应`<input>`控件的`input`事件，其他表单控件视情况而定。当只激活实时验证时，失焦验证会跳过此规则并且覆盖原来的结果，因此通常我们需要采用实时与失焦叠加的方式`input+blur`。

下面的例子中，对用户名长度和邮箱格式的判断为实时验证。其中邮箱的验证没有采用实时与失焦叠加的方式，可以发现这种方式不是很合理。

<div class="m-example"></div>

```xml
<form class="m-form">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.name} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">邮箱<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.email} maxlength=20 placeholder="请输入邮箱" />
        </span>
    </div>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: {
            name: [
                { type: 'isFilled', trigger: 'blur', message: '请输入用户名！' },
                { type: 'isLength', trigger: 'input+blur', message: '请输入4~12个字符！', options: { min: 4, max: 12 } },
            ],
            email: [
                { type: 'isFilled', trigger: 'blur', message: '请输入邮箱！' },
                { type: 'isEmail', trigger: 'input', message: '邮箱格式不正确！' },
            ],
        },
    }
});
```

#### 表单限制

在表单控件的值改变时，对该值限制在规定的长度或范围内，如`<input>`控件的部分`type`和`maxlength`的限制行为等：

<div class="m-example"></div>

```xml
<form class="m-form">
    <div class="form_item">
        <label class="form_label">姓名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField maxlength=4 placeholder="不超过4个字符" />
        </span>
    </div>
</form>
```

## 案例

前面的示例只是局部展示Regular UI表单验证体系的使用方法，达到的效果不一定符合交互需求。下面举几种比较合理的案例：

按照表单提交按钮在什么情况下可点击，可以分为以下几种常见且比较合理的情况：始终可点、必填项有内容可点、所有项内容正确时才可点。

### 始终可点

表单提交按钮始终可点。

表现为表单中所有控件的所有行为必须进行提交验证，适当采用失焦和实时验证加以帮助。

<div class="m-example"></div>

```xml
<form class="m-form">
<validation ref="validation">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.name} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">邮箱<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField rules={rules.email} maxlength=20 placeholder="请输入邮箱" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">手机号码：</label>
        <span class="form_field">
            <inputField rules={rules.phone} maxlength=11 placeholder="请输入手机号码" />
        </span>
    </div>
    <div class="form_item">
        <span class="form_field"><a class="u-btn u-btn-primary" on-click={this.submit()}>提交</a></span>
    </div>
</validation>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: {
            name: [
                { type: 'isFilled', trigger: 'blur', message: '请输入用户名！' },
                { type: 'isLength', trigger: 'blur', message: '请输入4~12个字符！', options: { min: 4, max: 12 } },
            ],
            email: [
                { type: 'isFilled', trigger: 'blur', message: '请输入邮箱！' },
                { type: 'isEmail', trigger: 'blur', message: '邮箱格式不正确！' },
            ],
            phone: [
                { type: 'is', trigger: 'blur', message: '手机号码格式不正确！', options: /^$|^\d{11}$/ },
            ],
        },
    },
    submit() {
        this.$refs.validation.$one('validate', (conclusion) => {
            if(conclusion.success)
                alert('提交成功！');
        }).validate();
    },
});
```

### 必填项有内容可点

当表单中所有必填项有内容时，表单提交按钮才可点。

表现为根据表单中必填项是否为空，使用计算属性来实时判断提交按钮是否可点。并且在这种情况下，通常采用三种验证相结合的方式。

<div class="m-example"></div>

```xml
<form class="m-form">
<validation ref="validation">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField value={user.name} rules={rules.name} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">邮箱<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField value={user.email} rules={rules.email} maxlength=20 placeholder="请输入邮箱" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">手机号码：</label>
        <span class="form_field">
            <inputField rules={rules.phone} maxlength=11 placeholder="请输入手机号码" />
        </span>
    </div>
    <div class="form_item">
        <span class="form_field"><a class="u-btn u-btn-primary" z-dis={!canSubmit} on-click={this.submit()}>提交</a></span>
    </div>
</validation>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        user: {},
        rules: {
            name: [
                { type: 'isFilled', trigger: 'blur', mute: 'blur', message: '请输入用户名！' },
                { type: 'isLength', trigger: 'blur', message: '请输入4~12个字符！', options: { min: 4, max: 12 } },
            ],
            email: [
                { type: 'isFilled', trigger: 'blur', mute: 'blur', message: '请输入邮箱！' },
                { type: 'isEmail', trigger: 'blur', message: '邮箱格式不正确！' },
            ],
            phone: [
                { type: 'is', trigger: 'blur', message: '手机号码格式不正确！', options: /^$|^\d{11}$/ },
            ]
        }
    },
    computed: {
        canSubmit() {
            return this.data.user.name && this.data.user.email;
        },
    },
    submit: function() {
        if(!this.$get('canSubmit'))
            return;

        this.$refs.validation.$one('validate', (conclusion) => {
            if(conclusion.success)
                alert('提交成功！');
        }).validate();
    }
});
```

### 所有项内容正确可点

当表单中所有项内容均符合要求时，表单提交按钮才可点。

表现为根据每个表单控件的验证结果，使用计算属性来实时判断提交按钮是否可点。这种情况下，一般就不需要进行提交验证了。

<div class="m-example"></div>

```xml
<form class="m-form">
<validation ref="validation">
    <div class="form_item">
        <label class="form_label">用户名<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField value={user.name} rules={rules.name} maxlength=12 placeholder="4~12个字符" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">邮箱<span class="form_required">*</span>：</label>
        <span class="form_field">
            <inputField value={user.email} rules={rules.email} maxlength=20 placeholder="请输入邮箱" />
        </span>
    </div>
    <div class="form_item">
        <label class="form_label">手机号码：</label>
        <span class="form_field">
            <inputField state="success" rules={rules.phone} maxlength=11 placeholder="请输入手机号码" />
        </span>
    </div>
    <div class="form_item">
        <span class="form_field"><a class="u-btn u-btn-primary" z-dis={!canSubmit} on-click={this.submit()}>提交</a></span>
    </div>
</validation>
</form>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        user: {},
        rules: {
            name: [
                { type: 'isFilled', trigger: 'input+blur', mute: 'input+blur', message: '请输入用户名！' },
                { type: 'isLength', trigger: 'input+blur', mute: 'input', message: '请输入4~12个字符！', options: { min: 4, max: 12 } },
            ],
            email: [
                { type: 'isFilled', trigger: 'input+blur', mute: 'input+blur', message: '请输入邮箱！' },
                { type: 'isEmail', trigger: 'input+blur', mute: 'input', message: '邮箱格式不正确！' },
            ],
            phone: [
                { type: 'is', trigger: 'input+blur', message: '手机号码格式不正确！', options: /^$|^\d{11}$/ },
            ],
        }
    },
    computed: {
        canSubmit() {
            return this.$refs.validation && this.$refs.validation.fields.every((field) => field.data.state === 'success');
        },
    },
    submit: function() {
        if(!this.$get('canSubmit'))
            return;

        alert('提交成功！');
    },
});
```

```css
.m-form fieldset{border:none;margin:0;padding:0;}.m-form legend{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;padding:0;border:none;}.m-form .form_item{*zoom:1;}.m-form .form_item:before,.m-form .form_item:after{display:table;content:"";line-height:0;}.m-form .form_item:after{clear:both;}.m-form .form_label{display:block;float:left;}.m-form .form_field{display:block;}.m-form-inline .form_item{display:inline-block;}.m-form-inline .form_label{float:none;display:inline-block;}.m-form-inline .form_field{display:inline-block;}.m-form legend{font-size:16px;border-bottom:1px solid #ddd;line-height:34px;margin:15px 0;color:#777;}.m-form .form_item{min-height:34px;margin-bottom:1em;}.m-form .form_label{text-align:right;width:100px;line-height:34px;}.m-form .form_field{margin-left:100px;line-height:34px;}.m-form .form_required{color:#dd4b39;}.m-form-inline .form_item{margin-bottom:0;margin-right:2em;}.m-form-inline .form_label{width:auto;}.m-form-inline .form_field{margin-left:0;}.u-tip{line-height:1.6;}
```
