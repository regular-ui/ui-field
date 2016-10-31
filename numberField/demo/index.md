## 示例
### 基本形式

大部分属性的用法与`<input type="number">`一致。

<div class="m-example"></div>

```xml
<label>数量：<numberField /></label>
```

### 步进
每次改变步数，可以为小数。
<div class="m-example"></div>

```xml
<label>数量：<numberField value="340" step="5.55" /></label>
```

### 键盘操作
支持键盘 ↑ ↓ 增减数字。
<div class="m-example"></div>

```xml
<label>数量：<numberField value="3" /></label>
```
### 事件
`change`事件在组件值发生改变时触发。请打开开发者工具查看数据变更。
<div class="m-example"></div>

```xml
<label>数量：<numberField value="3" on-change={this._onChange($event)} /></label>
```

```javascript
let component = new RGUI.Component({
    template,
    _onChange(e) {
        console.log(e.value);
    }
});
```

