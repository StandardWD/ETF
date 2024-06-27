
// SET INT variable AS value


export const TOKEN_TYPE = {
	"Indentifier": {
		validate: (char) => char.toLowerCase() != char.toUpperCase(),
		spec: "MULTI",
		type: "ID_TK"
	},
	"String": {
		validate: (char) => [`"`, `'`].includes(char),
		spec: "BTOE",
		type: "STRING_TK"

	},
	"Number": {
		validate: (char) => char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0),
		spec: "MULTI",
		type: "NUM_TK"
	},
	
	"OpenParen": {
		validate: (char) => char == "(",
		spec: "SINGLE",
		type:"OPAR_TK"

	},
	"CloseParen": {
		validate: (char) => char == ")",
		spec: "SINGLE",
		type: "CPAR_TK"
	},
	"BinaryOp": {
		validate: (char) => "+-*/%".split("").includes(char),
		spec: "SINGLE",
		type: "BINOP_TK"
	},
	"Skippable": {
		validate: (char) => ["", " ", "\t", "\n", "\n\r"].includes(char),
		spec: "SKIP",
		type: "ETFISGOOD_TK"
	}

};


const KEYWORDS = {
	"SET": {
		type: "SET_TK"
	},
	"AS": {
		type: "AS_TK"
	},
	"INT": {
		type: "TINT_TK"
	},
	"STRING": {
		type: "TSTRING_TK"
	},
	"FLOAT": {
		type: "TFLOAT_TK"
	},
	"BOOL": {
		type: "TBOOL_TK"
	}
};

export class Token {
	constructor(value, type) {
		this.value = value ?? "";
		this.type = type;
	}
}
const token = (value, type) => new Token(value, type);

export function tokenize(raw) {
	const tokens = [];
	const src = raw.split("");
	const initLength = src.length;
	while (src.length > 0) {
		const tk = src[0];
		let tkType = Object.keys(TOKEN_TYPE).find(x => TOKEN_TYPE[x].validate(tk));
		tkType = TOKEN_TYPE[tkType];
		if (!tkType) throw new Error(`[ETF ERROR]: Unrecognizable token at character ${initLength - src.length}`);
		else {
			let result = "";
			switch(tkType.spec){
			case "MULTI":
				while (src.length > 0 && tkType.validate(src[0])) result += src.shift();
				//Check keyword
				const kw = KEYWORDS[result];
				if(kw) tokens.push(token(result, kw.type));
				else tokens.push(token(result, tkType.type));
				break;

			case "BTOE":
				do result += src.shift();
				while (src.length > 0 && !tkType.validate(src[0]));
				result += src.shift();
				tokens.push(token(result, tkType.type));
				break;
			case "SKIP":
				src.shift();
				break;
			default: 
				tokens.push(token(src.shift(), tkType.type));
			}

		}
	}
	return tokens;
}