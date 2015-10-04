var expect = require('expect.js');

describe('JsonPath', function() {
	var jpath = require('./index.js');
	var i = 0;
	jpath.separator('/');

	get({}, '/', {});
	get({}, '/a', undefined);
	get({ a:1 }, '/a', 1);
	get(null, '/a', undefined);
	get(1, '/a', undefined);

	get({ a: { b: { c: { d : 1 } } } }, '/a/b/c', { d: 1 });
	get({ a: { b: { c: { d : 1 } } } }, '/a/b/c/d', 1);
	get({ a: { b: { c: { d : 1 } } } }, '/a/d/c/d', undefined);
	get({ a: [1,2,3,4], b: { '0': 1, '3': 2 }}, '/a/2', 3);
	get({ a: [1,2,3,4], b: { '0': 1, '3': 2 }}, '/b/3', 2);

	set({}, '/', 1, 1);
	set({}, '/b', 1, { b: 1 });
	set(null, '/b', 1, null);

	set({ a: [1, 2] }, '/a/0', 'ho', { a: ['ho', 2]});
	set({ a: [1, 2] }, '/a/2', 'ho', { a: [1, 2, 'ho']});
	set({ a: [1, 2] }, '/a/3', 'ho', { a: [1, 2, ,'ho']});

	set({ a: { '0': 1, '1': 2 } }, '/a/0', 'ho', { a: { '0': 'ho', '1': 2 } });
	set({ a: { '0': 1, '1': 2 } }, '/a/2', 'ho', { a: { '0': 1, '1': 2, '2': 'ho' } });
	set({ a: { '0': 1, '1': 2 } }, '/a/3', 'ho', { a: { '0': 1, '1': 2, '3': 'ho' } });
	set({ a: 1 }, '/b/c', 'ho', { a: 1 });

	del({ a: 1 }, '/a', {});
	del(null, '/a', null);
	del([1,2,3,4], '/1', [1,3,4]);

	del({ a: { b: { c: { d: {} } } } }, '/a/b/c/d', { a: { b: { c: {} } } });
	del({ a: { b: { c: { d: {} } } } }, '/a/b', { a: {} });
	del({ a: { '0': 1, '1': 2 } }, '/a/0', { a: { '1': 2 } });

	put({}, '/a/b/c', 1, { a: { b: { c: 1 } } });
	put(null, '/a/b/c', 1, { a: { b: { c: 1 } } });
	put({ a: { b: { c: 2 } } }, '/a/b/c', 1, { a: { b: { c: 1 } } });
	put(1, '/a/0/c', 1, { a: { '0': { c: 1 } } });

	function get(input, path, output) {
		it('get `' + path + '` case #' + i++, function() {
			expect(jpath(input).get(path)).to.be.eql(output);
		});
	}

	function set(input, path, value, output) {
		it('set `' + path + '` case #' + i++, function() {
			expect(jpath(input).set(path, value)).to.be.eql(output);
		});
	}

	function del(input, path, output) {
		it('del `' + path + '`case #`' + i++, function() {
			expect(jpath(input).del(path)).to.be.eql(output);
		});
	}

	function put(input, path, value, output) {
		it('put `' + path + '`case #`' + i++, function() {
			expect(jpath(input).put(path, value)).to.be.eql(output);
		});
	}
});