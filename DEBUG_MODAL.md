# 编辑弹窗问题排查指南

## 问题描述
点击编辑按钮后，弹窗没有显示。

## 排查步骤

### 1. 检查浏览器控制台
打开浏览器开发者工具（F12），查看 Console 标签页，检查是否有以下日志：
- `handleEdit called` - 确认点击事件已触发
- `openEditModal called successfully` - 确认 openModal 方法已调用
- `useModalInner callback called` - 确认弹窗组件已接收到数据
- `Modal opened successfully` - 确认弹窗已打开

如果有错误信息，请记录错误详情。

### 2. 检查网络请求
在 Network 标签页中，检查是否有以下请求：
- `/bi/report/mesFlowCardDetailReport` - 列表数据请求
- `/bi/report/mesFlowCardDetailReport/edit` - 编辑保存请求（点击确定后）

### 3. 检查 DOM 元素
在 Elements 标签页中，搜索 `ant-modal` 或 `basic-modal`，检查：
- 弹窗元素是否存在但被隐藏（`display: none` 或 `visibility: hidden`）
- z-index 是否足够高
- 是否有其他元素遮挡

### 4. 检查 Vue 组件状态
在 Vue DevTools 中（如果已安装）：
- 检查 `CoilProdReport` 组件的状态
- 检查 `CoilProdReportModal` 组件的状态
- 检查 `registerEditModal` 是否正确注册
- 检查弹窗的 `open` 属性是否为 `true`

### 5. 常见问题及解决方案

#### 问题 1: 弹窗组件未正确注册
**症状**: 控制台没有 `useModalInner callback called` 日志
**解决方案**: 
- 检查 `CoilProdReportModal` 组件是否正确导入
- 检查 `@register="registerEditModal"` 是否正确绑定

#### 问题 2: openModal 方法未正确调用
**症状**: 控制台没有 `openEditModal called successfully` 日志
**解决方案**:
- 检查 `handleEdit` 函数是否正确绑定到编辑按钮
- 检查 `openEditModal` 方法是否存在

#### 问题 3: 弹窗被隐藏或遮挡
**症状**: 控制台日志正常，但看不到弹窗
**解决方案**:
- 检查 CSS 样式，确保弹窗可见
- 检查 z-index 值
- 检查是否有其他元素遮挡

#### 问题 4: 数据传递问题
**症状**: 弹窗打开但数据为空
**解决方案**:
- 检查 `record` 数据是否正确传递
- 检查 `setFieldsValue` 是否正确设置表单值

## 代码修改记录

### 已添加的调试代码

1. **CoilProdReport.vue** - `handleEdit` 函数中添加了日志和错误处理
2. **CoilProdReportModal.vue** - `useModalInner` 回调中添加了日志

### 建议的进一步排查

如果上述步骤无法解决问题，可以尝试：

1. **检查组件注册顺序**
   - 确保 `CoilProdReportModal` 组件在模板中正确渲染
   - 确保 `registerEditModal` 在组件挂载后可用

2. **检查事件绑定**
   - 确认编辑按钮的 `onClick` 事件正确绑定
   - 确认 `TableAction` 组件正确渲染操作按钮

3. **检查依赖**
   - 确认 `useModal` 和 `useModalInner` 正确导入
   - 确认 `BasicModal` 组件正常工作

4. **对比其他正常工作的弹窗**
   - 查看其他页面的弹窗实现，对比差异
   - 检查是否有特殊的配置或依赖

## 使用 Chrome DevTools MCP 监控

如果配置了 chrome-devtools MCP，可以使用以下命令监控页面：

1. **打开页面**:
   ```
   导航到 http://localhost:3100/bi/reports/coilProductionReport/CoilProdReport
   ```

2. **监控控制台消息**:
   ```
   列出所有控制台消息
   ```

3. **监控网络请求**:
   ```
   列出所有网络请求
   ```

4. **截图检查**:
   ```
   截图当前页面
   ```

5. **检查 DOM**:
   ```
   获取页面快照
   ```

## 下一步行动

1. 刷新页面，重新测试编辑功能
2. 查看浏览器控制台日志，记录所有输出
3. 如果问题仍然存在，请提供：
   - 控制台错误信息
   - 网络请求详情
   - Vue DevTools 中的组件状态
   - 任何其他相关日志
