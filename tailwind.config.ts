/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}", // 适配 Next.js 目录结构
      "./components/**/*.{js,ts,jsx,tsx}", // 适配组件目录
      "./app/**/*.{js,ts,jsx,tsx}", // 如果使用 app 目录
    ],
    theme: {
      extend: {
        // 自定义扩展配置
        boxShadow: {
          xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // 自定义 switch 的阴影
        },
        colors: {
          primary: "#3b82f6", // 自定义主色（蓝色）
          input: "#e5e7eb", // 未选中状态的背景色
          ring: "#93c5fd", // 焦点边框颜色
          background: "#ffffff", // 默认背景色
          foreground: "#1f2937", // 暗黑模式下的前景色
          "primary-foreground": "#f9fafb", // 选中后的 thumb 前景色
        },
        transitionProperty: {
          transform: "transform",
        },
      },
    },
    variants: {
      extend: {
        backgroundColor: ["data-[state=checked]", "data-[state=unchecked]", "disabled", "dark"],
        translate: ["data-[state=checked]", "data-[state=unchecked]"],
        ringWidth: ["focus-visible"],
      },
    },
    plugins: [],
  }
  