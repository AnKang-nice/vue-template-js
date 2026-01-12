/** @type {import("stylelint").Config} */
export default {
  "extends": ["stylelint-config-standard", "stylelint-config-standard-scss", "stylelint-config-recommended-vue"],
  overrides: [
    // 扫描 .vue/html 文件中的 <style> 标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {
  }
};
