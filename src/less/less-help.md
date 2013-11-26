Overview
=========================================
LESS is an extension to CSS. It's not only backwards compatible with CSS, but the extra features it adds use existing CSS syntax. This makes using LESS quite easy and if in doubt, one can always fall back to CSS!

Much more detailed information about what is possible with LESS, including lots of examples, can be found on http://lesscss.org

The features we use most are nested rules, variables and mixins.

Nested Rules
-----------------------------------------
Rather than constructing long selector names to specify inheritance, in LESS you can simply nest selectors inside other selectors. This makes inheritance clear and style sheets shorter.

Variables
-----------------------------------------
Variables allow you to specify widely used values in a single place, and then re-use them throughout the style sheet. Variables always start with @. They are defined as @variable: value; and might be used instead of the value throughout the file.

Mixins
-----------------------------------------
Mixins allow you to embed all the properties of a class into another class by simply including the class name as one of its properties. It’s just like variables, but for whole classes. Mixins can also behave like functions and take arguments in (), but then they are no longer recognized as a class. Since they are similiar to classes, mixins always start with a dot.

The Setup Here
=========================================
Variables and mixins are defined in the file less-mixins.less. To use them in other LESS files, less-mixins.less has to be imported into the file first. Since it consists of LESS specific stuff only, importing does not generate any extra CSS.

Mixins used for media queries are defined right before the media query itself. We call them macros and use them to make sure the styles in the media query and the media query fallback stay exactly the same.

A Note About Comments
-----------------------------------------
CSS-style comments between /* */ are preserved when compiling a LESS file to CSS. Single-line comments starting with // are also valid in LESS, but they are ‘silent’, they don’t show up in the compiled CSS output. So they are perfect for us to use for LESS-specific documenting.