const vs = {
	base: 'vs',
	inherit: false,
	rules: [
		{ token: '', foreground: '000000', background: 'fffffe' },
		{ token: 'invalid', foreground: 'cd3131' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '001188' },
		{ token: 'variable.predefined', foreground: '4864AA' },
		{ token: 'constant', foreground: 'dd0000' },
		{ token: 'comment', foreground: '008000' },
		{ token: 'number', foreground: '098658' },
		{ token: 'number.hex', foreground: '3030c0' },
		{ token: 'regexp', foreground: '800000' },
		{ token: 'annotation', foreground: '808080' },
		{ token: 'type', foreground: '008080' },

		{ token: 'delimiter', foreground: '000000' },
		{ token: 'delimiter.html', foreground: '383838' },
		{ token: 'delimiter.xml', foreground: '0000FF' },

		{ token: 'tag', foreground: '800000' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta.scss', foreground: '800000' },
		{ token: 'metatag', foreground: 'e00000' },
		{ token: 'metatag.content.html', foreground: 'FF0000' },
		{ token: 'metatag.html', foreground: '808080' },
		{ token: 'metatag.xml', foreground: '808080' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '863B00' },
		{ token: 'string.key.json', foreground: 'A31515' },
		{ token: 'string.value.json', foreground: '0451A5' },

		{ token: 'attribute.name', foreground: 'FF0000' },
		{ token: 'attribute.value', foreground: '0451A5' },
		{ token: 'attribute.value.number', foreground: '098658' },
		{ token: 'attribute.value.unit', foreground: '098658' },
		{ token: 'attribute.value.html', foreground: '0000FF' },
		{ token: 'attribute.value.xml', foreground: '0000FF' },

		{ token: 'string', foreground: 'A31515' },
		{ token: 'string.html', foreground: '0000FF' },
		{ token: 'string.sql', foreground: 'FF0000' },
		{ token: 'string.yaml', foreground: '0451A5' },

		{ token: 'keyword', foreground: '0000FF' },
		{ token: 'keyword.json', foreground: '0451A5' },
		{ token: 'keyword.flow', foreground: 'AF00DB' },
		{ token: 'keyword.flow.scss', foreground: '0000FF' },

		{ token: 'operator.scss', foreground: '666666' },
		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '666666' },
		{ token: 'predefined.sql', foreground: 'C700C7' },
	],
	colors: {
		'editor.background': '#FFFFFE',
		'editor.foreground': '#000000',
		'editor.inactiveSelectionBackground': '#E5EBF1',
		'editorIndentGuide.background': '#D3D3D3',
		'editorIndentGuide.activeBackground': '#939393',
		'editor.selectionHighlightBackground': '#ADD6FF4D'
	}
};

const vsDark = {
	base: 'vs-dark',
	inherit: false,
	rules: [
		{ token: '', foreground: 'D4D4D4', background: '1E1E1E' },
		{ token: 'invalid', foreground: 'f44747' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'operator', foreground: 'FF0000' },
		{ token: 'variable', foreground: '74B0DF' },
		{ token: 'variable.predefined', foreground: '4864AA' },
		{ token: 'variable.parameter', foreground: '9CDCFE' },
		{ token: 'constant', foreground: '569CD6' },
		{ token: 'comment', foreground: '608B4E' },
		{ token: 'number', foreground: 'B5CEA8' },
		{ token: 'number.hex', foreground: '5BB498' },
		{ token: 'regexp', foreground: 'B46695' },
		{ token: 'annotation', foreground: 'cc6666' },
		{ token: 'type', foreground: '3DC9B0' },

		{ token: 'delimiter', foreground: 'DCDCDC' },
		{ token: 'delimiter.html', foreground: '808080' },
		{ token: 'delimiter.xml', foreground: '808080' },

		{ token: 'tag', foreground: '569CD6' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta.scss', foreground: 'A79873' },
		{ token: 'meta.tag', foreground: 'CE9178' },
		{ token: 'metatag', foreground: 'DD6A6F' },
		{ token: 'metatag.content.html', foreground: '9CDCFE' },
		{ token: 'metatag.html', foreground: '569CD6' },
		{ token: 'metatag.xml', foreground: '569CD6' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '9CDCFE' },
		{ token: 'string.key.json', foreground: '9CDCFE' },
		{ token: 'string.value.json', foreground: 'CE9178' },

		{ token: 'attribute.name', foreground: '9CDCFE' },
		{ token: 'attribute.value', foreground: 'CE9178' },
		{ token: 'attribute.value.number.css', foreground: 'B5CEA8' },
		{ token: 'attribute.value.unit.css', foreground: 'B5CEA8' },
		{ token: 'attribute.value.hex.css', foreground: 'D4D4D4' },

		{ token: 'string', foreground: 'CE9178' },
		{ token: 'string.sql', foreground: 'FF0000' },

		{ token: 'keyword', foreground: '569CD6' },
		{ token: 'keyword.flow', foreground: 'C586C0' },
		{ token: 'keyword.json', foreground: 'CE9178' },
		{ token: 'keyword.flow.scss', foreground: '569CD6' },

		{ token: 'operator.scss', foreground: '909090' },
		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '909090' },
		{ token: 'predefined.sql', foreground: 'FF00FF' },
		{ token: 'operator', foreground: 'FF0000' },
	],
	colors: {
		'editor.background': '#1E1E1E',
		'editor.foreground': '#D4D4D4',
		'editor.inactiveSelectionBackground': '#3A3D41',
		'editorIndentGuide.background': '#404040',
		'editorIndentGuide.activeBackground': '#707070',
		'editor.selectionHighlightBackground': '#ADD6FF26',
	}
};

const hcBlack = {
	base: 'hc-black',
	inherit: false,
	rules: [
		{ token: '', foreground: 'FFFFFF', background: '000000' },
		{ token: 'invalid', foreground: 'f44747' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '1AEBFF' },
		{ token: 'variable.parameter', foreground: '9CDCFE' },
		{ token: 'constant', foreground: '569CD6' },
		{ token: 'comment', foreground: '608B4E' },
		{ token: 'number', foreground: 'FFFFFF' },
		{ token: 'regexp', foreground: 'C0C0C0' },
		{ token: 'annotation', foreground: '569CD6' },
		{ token: 'type', foreground: '3DC9B0' },

		{ token: 'delimiter', foreground: 'FFFF00' },
		{ token: 'delimiter.html', foreground: 'FFFF00' },

		{ token: 'tag', foreground: '569CD6' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta', foreground: 'D4D4D4' },
		{ token: 'meta.tag', foreground: 'CE9178' },
		{ token: 'metatag', foreground: '569CD6' },
		{ token: 'metatag.content.html', foreground: '1AEBFF' },
		{ token: 'metatag.html', foreground: '569CD6' },
		{ token: 'metatag.xml', foreground: '569CD6' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '9CDCFE' },
		{ token: 'string.key', foreground: '9CDCFE' },
		{ token: 'string.value', foreground: 'CE9178' },

		{ token: 'attribute.name', foreground: '569CD6' },
		{ token: 'attribute.value', foreground: '3FF23F' },

		{ token: 'string', foreground: 'CE9178' },
		{ token: 'string.sql', foreground: 'FF0000' },

		{ token: 'keyword', foreground: '569CD6' },
		{ token: 'keyword.flow', foreground: 'C586C0' },

		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '909090' },
		{ token: 'predefined.sql', foreground: 'FF00FF' },
	],
	colors: {
		'editor.background': '#000000',
		'editor.foreground': '#FFFFFF',
		'editorIndentGuide.background': 'FFFFFF',
		'editorIndentGuide.activeBackground': '#FFFFFF',
	}
};

const hcWhite = {
	base: 'hc-light',
	inherit: false,
	rules: [
		{ token: '', foreground: '292929', background: 'FFFFFF' },
		{ token: 'invalid', foreground: 'B5200D' },
		{ token: 'emphasis', fontStyle: 'italic' },
		{ token: 'strong', fontStyle: 'bold' },

		{ token: 'variable', foreground: '264F70' },
		{ token: 'variable.predefined', foreground: '4864AA' },
		{ token: 'constant', foreground: 'dd0000' },
		{ token: 'comment', foreground: '008000' },
		{ token: 'number', foreground: '098658' },
		{ token: 'number.hex', foreground: '3030c0' },
		{ token: 'regexp', foreground: '800000' },
		{ token: 'annotation', foreground: '808080' },
		{ token: 'type', foreground: '008080' },

		{ token: 'delimiter', foreground: '000000' },
		{ token: 'delimiter.html', foreground: '383838' },

		{ token: 'tag', foreground: '800000' },
		{ token: 'tag.id.pug', foreground: '4F76AC' },
		{ token: 'tag.class.pug', foreground: '4F76AC' },
		{ token: 'meta.scss', foreground: '800000' },
		{ token: 'metatag', foreground: 'e00000' },
		{ token: 'metatag.content.html', foreground: 'B5200D' },
		{ token: 'metatag.html', foreground: '808080' },
		{ token: 'metatag.xml', foreground: '808080' },
		{ token: 'metatag.php', fontStyle: 'bold' },

		{ token: 'key', foreground: '863B00' },
		{ token: 'string.key.json', foreground: 'A31515' },
		{ token: 'string.value.json', foreground: '0451A5' },

		{ token: 'attribute.name', foreground: '264F78' },
		{ token: 'attribute.value', foreground: '0451A5' },

		{ token: 'string', foreground: 'A31515' },
		{ token: 'string.sql', foreground: 'B5200D' },

		{ token: 'keyword', foreground: '0000FF' },
		{ token: 'keyword.flow', foreground: 'AF00DB' },

		{ token: 'operator.sql', foreground: '778899' },
		{ token: 'operator.swift', foreground: '666666' },
		{ token: 'predefined.sql', foreground: 'C700C7' },
	],
	colors: {
		'editor.background': '#FFFFFF',
		'editor.foreground': '#292929',
		'editorIndentGuide.background': '#292929',
		'editorIndentGuide.activeBackground': '#292929',
	}
};

const dCol = {
// base
	'bg': '#282A36',
	'fg': '#F8F8F2',
	'selection': '#44475A',
    'comment': '#6272A4',
    'cyan': '#8BE9FD',
    'green': '#50FA7B',
    'orange': '#FFB86C',
    'pink': '#FF79C6',
    'purple': '#BD93F9',
    'red': '#FF5555',
    'yellow': '#F1FA8C',

// ansi:
    'c0': '#21222C',
    'c1': '#FF5555',
	'c2': '#50FA7B',
	'c3': '#F1FA8C',
	'c4': '#BD93F9',
	'c5': '#FF79C6',
	'c6': '#8BE9FD',
	'c7': '#F8F8F2',
	'c8': '#6272A4',
	'c9': '#FF6E6E',
	'c10': '#69FF94',
	'c11': '#FFFFA5',
	'c12': '#D6ACFF',
	'c13': '#FF92DF',
	'c14': '#A4FFFF',
	'c15': '#FFFFFF',

// brightOther:
// # Temporary (awaiting fix)
    'temp-quotes': '#E9F284',
	'temp=property-quotes': '#8BE9FE',

// other:
	'line-highlight': '#44475A75',
	'non-text': '#FFFFFF1A',
	'white': '#FFFFFF',
	'tab-drop-bg': '#44475A70',

// # UI Variants
	'bg-lighter': '#424450',
	'bg-light': '#343746',
	'bg-dark': '#21222C',
	'bg-darker': '#191A21'
}

const decToHex = percent => Math.round((percent / 100) * 255).toString(16).padStart(2, '0').toUpperCase();
const toRGBA = (rgbHex, alphaDec) => `${rgbHex}${decToHex(alphaDec)}`;

const dracula = {
	base: 'vs-dark',
	inherit: false,
	rules: [
		{ token: '', foreground: 'D4D4D4', background: '1E1E1E' },
		{ token: 'invalid', foreground: dCol.red, fontStyle: 'underline italic' },
		{ token: 'emphasis', fontStyle: 'italic'},
		{ token: 'strong', fontStyle: 'bold'},

		{ token: 'variable', foreground: dCol.fg },
		{ token: 'parameter', foreground: dCol.orange, fontStyle: 'italic' },
		{ token: 'constant', foreground: dCol.purple },
		{ token: 'comment', foreground: dCol.comment },
		{ token: 'number', foreground: dCol.purple },
		{ token: 'number.hex', foreground: dCol.c1 },
		{ token: 'regexp', foreground: dCol.yellow },
		{ token: 'annotation', foreground: dCol.pink },
		{ token: 'type', foreground: dCol.cyan, fontStyle: 'italic' },
		{ token: 'typeParameter', foreground: dCol.orange },
		{ token: 'function', foreground: dCol.green },
		{ token: 'keyword', foreground: dCol.pink, fontStyle: 'bold' },
		{ token: 'declaration', foreground: dCol.orange },

		{ token: 'class', foreground: dCol.cyan, fontStyle: 'normal' },
		{ token: 'interface', foreground: dCol.cyan, fontStyle: 'normal' },
		{ token: 'property', foreground: dCol.green },
		{ token: 'decorator', foreground: dCol.green },
		{ token: 'string', foreground: dCol.yellow }
	],
	colors: {
		'editor.background': dCol.bg,
		'editor.foreground': dCol.fg,
		'editorLineNumber.foreground': dCol.comment,

		'editor.selectionBackground': dCol.selection,
		'editor.selectionHighlightBackground': dCol["bg-lighter"],
		'editor.foldBackground': toRGBA(dCol["bg-dark"], 80),

		'editor.wordHighlightBackground': toRGBA(dCol.cyan, 50),
		'editor.wordHighlightStrongBackground': toRGBA(dCol.green, 50),

		'editor.findMatchBackground': toRGBA(dCol.cyan, 50),
		'editor.findMatchHighlightBackground': toRGBA(dCol.white, 40),
		'editor.findRangeHighlightBackground': dCol["line-highlight"],

		'editor.hoverHighlightBackground': toRGBA(dCol.cyan, 50),

		'editor.lineHighlightBorder': dCol.selection,
		'editorLink.activeForeground': dCol.cyan,
		'editor.rangeHighlightBackground': toRGBA(dCol.cyan, 15),
		'editor.snippetTabstopHighlightBackground': dCol.bg,
		'editor.snippetTabstopHighlightBorder': dCol.comment,
		'editor.snippetFinalTabstopHighlightBackground': dCol.bg,
		'editor.snippetFinalTabstopHighlightBorder': dCol.green,
		'editorWhitespace.foreground': dCol["non-text"],
		'editorIndentGuide.background': dCol["non-text"],
		'editorIndentGuide.activeBackground': toRGBA(dCol.white, 45),
		'editorRuler.foreground': dCol["non-text"],

		'editorCodeLens.foreground': dCol.comment,

		'editorBracketHighlight.foreground1': dCol.fg,
		'editorBracketHighlight.foreground2': dCol.pink,
		'editorBracketHighlight.foreground3': dCol.cyan,
		'editorBracketHighlight.foreground4': dCol.green,
		'editorBracketHighlight.foreground5': dCol.purple,
		'editorBracketHighlight.foreground6': dCol.orange,
		'editorBracketHighlight.unexpectedBracket.foreground': dCol.red,

		'editorOverviewRuler.border': dCol["bg-darker"],
		'editorOverviewRuler.selectionHighlightForeground': dCol.orange,
		'editorOverviewRuler.wordHighlightForeground': dCol.cyan,
		'editorOverviewRuler.wordHighlightStrongForeground': dCol.green,
		'editorOverviewRuler.modifiedForeground': toRGBA(dCol.cyan, 80),
		'editorOverviewRuler.addedForeground':    toRGBA(dCol.green, 80),
		'editorOverviewRuler.deletedForeground':  toRGBA(dCol.red, 80),
		'editorOverviewRuler.errorForeground':    toRGBA(dCol.red, 80),
		'editorOverviewRuler.warningForeground':  toRGBA(dCol.orange, 80),
		'editorOverviewRuler.infoForeground':     toRGBA(dCol.cyan, 80),

		'editorError.foreground': dCol.red,
		'editorWarning.foreground': dCol.cyan,

		'editorGutter.modifiedBackground': toRGBA(dCol.cyan, 80),
		'editorGutter.addedBackground':    toRGBA(dCol.green, 80),
		'editorGutter.deletedBackground':  toRGBA(dCol.red, 80),

		'sideBar.background': dCol["bg-dark"],
		'sideBarTitle.foreground': dCol.fg,
		'sideBarSectionHeader.background': dCol.bg,
		'sideBarSectionHeader.border': dCol["bg-darker"],

		'minimap.background': dCol.bg,
		'minimap.foregroundOpacity': '0x000f',
		'scrollbarSlider.background': dCol.red,
	}
};

export const customThemeSyntaxHighlight = [
	{ name: "Comments", token: 'comment', demo: "// Welcome to DuckCode" },
	{ name: "String", token: 'string', demo: "'Welcome to DuckCode!'" },
	{ name: "Keywords", token: 'keyword', demo: "for, while, if, else, break, function, class, ..." },
	{ name: "Invalid Code", token: 'invalid', demo: "let 123 = 'DuckCode'; // JavaScript" },
	{ name: "Number", token: 'number', demo: "12345.6789" },
	{ name: "Hexadecimal Number", token: 'number.hex', demo: "0x20F3EAB5" },
	{ name: "Regular Expressions", token: 'regexp', demo: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
	{ name: "Annotations", token: 'annotation', demo: "@Override // Java"},
	{ name: "Types, including classes", token: 'type', demo: "int, boolean, Math, String, ... // Java" },
	{ name: "Type Parameters", token: 'typeParameter', demo: "class HashMap<K, V> {...} // Java" },
	{ name: "Function Names", token: 'function', demo: "greet() { ... }" },
	{ name: "Method Names", token: 'method', demo: "myObject.doSomething();" },
	{ name: "Macros/Preprocessors", token: "macro", demo: "#include<stdio.h> // C" },
	{ name: "Interface", token: "interface", demo: "interface Greetable { ... }" },
	{ name: "Class property", token: "property", demo: "myObject.myProperty" },
	{ name: "Decorators (JS-specific)", token: "decorator", demo: "@readonly" }
]

export const presetThemes = [
	{ name: "Visual Studio - Light", theme: vs, value: "vs" },
	{ name: "Visual Studio - Dark", theme: vsDark, value: "vs-dark" },
	{ name: "High Contrast - Black", theme: hcBlack, value: "hc-black" },
	{ name: "High Contrast - White", theme: hcWhite, value: "hc-white" },
	{ name: "Dracula (experimental)", theme: dracula, value: "dracula" }
];