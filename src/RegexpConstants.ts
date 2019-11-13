//markdown regex
export var mdFrontMatterContentRegExp: RegExp = /(?<=---\s)[\s\S]*?(?=\s---)/;
export var mdFrontMatterSectionRegExp: RegExp = /---\s[\s\S]*?\s---/;
export var mdFileRegExp: RegExp = /\\[^\\]+\.md/;
export var mdFileRegExpFlipped: RegExp = /\/[^\/]+\.md/;

//fountain regex
export var ftFrontMatterContentRegExp: RegExp = /(.{1,}(\s\n))*/;
export var fountainFileRegExp: RegExp = /\\[^\\]+\.fountain/;
export var fountainFileRegExpFlipped: RegExp = /\/[^\/]+\.fountain/;