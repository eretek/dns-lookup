/*! Eretek Online Araçlar #17 — DNS Kayıt Sorgulayıcı */
ERT.def('17', {
	run: function (v, c) {
		var D = ERT.dns, d = D.normName(v.name);
		if (!d) { throw c.fe('name', 'badDomain'); }
		return D.query(d, v.type, v.res).then(function (r) {
			var rows = r.answers.map(function (a) { return [a.name, a.type, a.TTL, a.type === 'TXT' ? D.txtJoin(a.data) : a.data]; });
			var msgs = [[r.status === 'ok' ? 'ok' : (r.status === 'nodata' || r.status === 'nxdomain' ? 'warn' : 'err'), c.t('st_' + r.status)]];
			if (r.chain.length) { msgs.push(['info', c.t('chain', { c: r.chain.join(' → ') })]); }
			msgs.push(['info', c.t('via', { r: r.resolver })]);
			var cols = [c.t('c_name'), c.t('c_type'), 'TTL', c.t('c_data')];
			return { big: d + ' ' + v.type, msgs: msgs, tables: rows.length ? [{ cols: cols, rows: rows }] : [], x: rows.length ? { copy: rows.map(function (x) { return x.join('\t'); }).join('\n') } : {}, v: { status: r.status, count: rows.length } };
		});
	}
});
