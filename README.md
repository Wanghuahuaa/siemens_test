### 运行项目
`yarn dev`

### 项目结构描述
- `index.html`：应用入口 HTML 模板。
- `src/`：主要源码目录。
  - `main.tsx`：应用启动入口。
  - `App.tsx`：根组件。
  - `App.css` / `index.css`：全局样式。
  - `components/`：React 组件目录。
    - `VariableTableEditor/`：一个示例组件，包含：
      - `index.tsx`：组件入口。
      - `index.less`：组件样式。
      - `const.tsx`：常亮及 解析/生成 VAR 变量定义文本的工具函数。
      - `editableCompnents.tsx`：编辑表格内可编辑单元格的子组件。
      - `store/`：状态管理（Context + useReducer）相关文件。
        - `index.tsx`：全局状态 Provider。
        - `index.d.ts`：类型定义。

- `public/`：静态资源目录。
- `vite.config.ts`：Vite 配置。
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`：TypeScript 配置。
- `eslint.config.js`：ESLint 配置。
