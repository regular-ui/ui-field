## 示例
### 基本形式

基本用法与`<input>`一致。

<div class="m-example"></div>

```xml
<label>密码：<inputField type="password" maxlength=6 placeholder="请输入密码" autofocus /></label>
```

### 单位

<div class="m-example"></div>

```xml
<label>速度：<inputField width="smw" value="340" unit="m/s" /></label>
```

### 验证

关于表单验证，详见[表单验证组件](https://regular-ui.github.io/ui-field/validation/index.html)。

<div class="m-example"></div>

```xml
<label>邮箱：<inputField maxlength=20 tip="请输入注册时的邮箱" rules={rules} /></label>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: [
            { type: 'isFilled', trigger: 'blur', message: '邮箱不能为空！' },
            { type: 'isEmail', trigger: 'input+blur', message: '请输入正确的邮箱！' },
        ],
    },
});
```
