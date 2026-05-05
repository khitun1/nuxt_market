import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default withNuxt([
  eslintPluginPrettierRecommended,
  {
    plugins: {
      // Явно указываем плагин, чтобы правила @typescript-eslint работали
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      quotes: ["error", "double"],
      "no-console": "error",
      curly: "error",
      semi: ["error", "always"],
      eqeqeq: "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-unreachable": "error",
      "prefer-const": "error",
      "arrow-body-style": "error",
      "object-shorthand": "error",
      "no-constant-condition": ["error", { checkLoops: true }],
      "vue/multi-word-component-names": "off",
    },
  },
]);
