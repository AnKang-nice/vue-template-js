import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginVue.configs["flat/essential"],
  // vue文件
  { files: ["**/*.vue"], plugins: { vue: pluginVue }, extends: ["plugin:vue/essential"], rules: { "vue/multi-word-component-names": "off", "vue/no-v-html": "off" } },
]);
