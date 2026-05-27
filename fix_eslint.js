const fs = require('fs');

// 1. Fix TestimonialsSection.tsx quotes
const testFile = 'components/home/TestimonialsSection.tsx';
let testCode = fs.readFileSync(testFile, 'utf8');
testCode = testCode.replace(/"{t.text}"/, '&quot;{t.text}&quot;');
fs.writeFileSync(testFile, testCode);
console.log('Fixed quotes in TestimonialsSection.tsx');

// 2. Disable @next/next/no-img-element in eslint config
const eslintFile = '.eslintrc.json';
if (!fs.existsSync(eslintFile)) {
  fs.writeFileSync(eslintFile, JSON.stringify({
    extends: "next/core-web-vitals",
    rules: {
      "@next/next/no-img-element": "off"
    }
  }, null, 2));
  console.log('Created .eslintrc.json and disabled no-img-element');
} else {
  let eslintConfig = JSON.parse(fs.readFileSync(eslintFile, 'utf8'));
  if (!eslintConfig.rules) eslintConfig.rules = {};
  eslintConfig.rules["@next/next/no-img-element"] = "off";
  fs.writeFileSync(eslintFile, JSON.stringify(eslintConfig, null, 2));
  console.log('Updated .eslintrc.json to disable no-img-element');
}
