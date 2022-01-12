// Copyright (c) 2022, Harpiya Software Technologies and contributors

harpiya.ui.form.on('Product', {

	set_route(frm) {
		if (frm.doc.route) return;
		if (frm.doc.title && frm.doc.product_category) {
			frm.call('make_route').then(r => {
				frm.set_value('route', r.message);
			});
		}
	}
});
