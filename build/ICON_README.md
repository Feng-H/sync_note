# 应用图标说明

## 需要准备的图标

在 `build/` 目录下需要放置应用图标：

### macOS
- **icon.icns** - macOS 应用图标
  - 可以使用在线工具生成：https://cloudconvert.com/png-to-icns
  - 或使用命令行工具：`iconutil`

### 图标尺寸要求
- 建议准备 1024x1024 的 PNG 图片
- 然后转换为 .icns 格式

### 临时方案
如果暂时没有图标，Electron 会使用默认图标，不影响打包。

## 生成图标的步骤

1. 准备一张 1024x1024 的 PNG 图片
2. 访问 https://cloudconvert.com/png-to-icns
3. 上传 PNG，转换为 ICNS
4. 下载并重命名为 `icon.icns`
5. 放到 `build/` 目录下
