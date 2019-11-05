export var mdFrontMatterContentRegExp: RegExp = /(?<=---\s)[\s\S]*?(?=\s---)/;
export var mdFrontMatterSectionRegExp: RegExp = /---\s[\s\S]*?\s---/;
export var mdFileRegExp: RegExp = /\\[^\\]+\.md/;
export var mdFileRegExpFlipped: RegExp = /\/[^\/]+\.md/;
