const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,

    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "off",
            "no-param-reassign": [
                "error",
                {
                    "props": false
                }
            ],
            "indent": [
                "warn",
                4
            ],
            "semi": ["warn"],
            // ignores: ["index.js"]
        }
    }
];