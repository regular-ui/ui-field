## 示例
### 基本形式

大部分属性的用法与`<textarea>`一致。

<div class="m-example"></div>

```xml
<label>备注：<textField placeholder="请输入备注" /></label>
```

### 验证

关于表单验证，详细请参见[表单验证](https://regular-ui.github.io/ui-field/validation/index.html)组件。

<div class="m-example"></div>

```xml
<label>邮箱：<textField rules={rules} maxlength=20 /></label>
```

```javascript
let component = new RGUI.Component({
    template,
    data: {
        rules: [
            { type: 'isFilled', trigger: 'blur', message: '请输入邮箱！' },
            { type: 'isEmail', trigger: 'input+blur', message: '请输入正确的邮箱！' },
        ],
    },
});
```
