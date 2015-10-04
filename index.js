module.exports = JsonPath;

JsonPath.prototype.get = get;
JsonPath.prototype.set = set;
JsonPath.prototype.del = del;
JsonPath.prototype.put = put;

JsonPath.parse = parse;
JsonPath.stringify = stringify;
JsonPath.normalize = normalize;

JsonPath.separator = separator;
JsonPath.separator('.');

function JsonPath(obj) {
	if (!(this instanceof JsonPath)) {
		return new JsonPath(obj);
	}

	this.obj = obj;
}

function get(path) {
	var obj = this.obj;
	var keys = parse(path);

	while (keys.length) {
		if (typeof obj !== 'object' || obj === null) { return; }
		obj = obj[keys.shift()];
	}

	return obj;
}

function set(path, value) {
	var obj = this.obj;
	var keys = parse(path);

	if (!keys.length) { this.obj = value; }

	while (keys.length && typeof obj === 'object' && obj !== null) {
		var key = keys.shift();

		if (keys.length) { obj = obj[key]; continue; }

		obj[key] = value;
	}

	return this.obj;
}

function del(path) {
	var obj = this.obj;
	var keys = parse(path);

	while (keys.length && typeof obj === 'object' && obj !== null) {
		var key = keys.shift();

		if (keys.length) { obj = obj[key]; continue; }

		if (key.match(/^\d+$/) && Array.isArray(obj)) {
			obj.splice(key, 1);
		} else {
			delete obj[key];
		}
	}

	return this.obj;
}

function put(path, value) {
	var obj = this.obj;
	var keys = parse(path);

	if (typeof obj !== 'object' || obj === null) {
		this.obj = obj = {};
	}

	while (keys.length) {
		var key = keys.shift();

		if (keys.length) {
			if (typeof obj[key] !== 'object' || obj === null) { obj[key] = {}; }
			obj = obj[key];
			continue;
		}

		obj[key] = value;
	}

	return this.obj;
}

function separator(sep) {
	this.SEPARATOR = sep;
	this.DOUBLE_SEPARATOR_REG = new RegExp('\\' + sep + '+', 'g');
	this.PATH_BEGIN_REG = new RegExp('(^#\\' + sep + '?|\\' + sep + '$|^\\' + sep +')', 'g');
}

function parse(path) {
	if (typeof path !== 'string') { throw new Error('json path must be a string for parsing'); }
	
	path = path
		.replace(JsonPath.DOUBLE_SEPARATOR_REG, JsonPath.SEPARATOR)
		.replace(JsonPath.PATH_BEGIN_REG, '');

	if (!path) { return []; }
	return path.split(JsonPath.SEPARATOR);
}

function stringify(arr) {
	if (!(arr instanceof Array)) { throw new Error('an array must be passed to stringify'); }

	return JsonPath.SEPARATOR + arr.join(JsonPath.SEPARATOR);
}

function normalize(path) {
	return JsonPath.stringify(JsonPath.parse(path));	
}