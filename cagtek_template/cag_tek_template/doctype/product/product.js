// Copyright (c) 2022, Harpiya Software Technologies and contributors

harpiya.ui.form.on('Product', {
	product_category(frm) {
		frm.trigger('set_route');
	},
	set_route(frm) {
		if (frm.doc.route) return;
		if (frm.doc.title && frm.doc.product_category) {
			frm.call('make_route').then(r => {
				frm.set_value('route', r.message);
			});
		}
	},
	refresh: (frm) => {
		frm.add_custom_button(__('Klasörden Resimleri Getir'), () => {
			const d = new harpiya.ui.Dialog({
				title: __('Klasörden Resimleri Getir'),
				fields: [
					{
						label: __('Klasör Adı'),
						fieldtype: 'Link',
						fieldname: 'folder',
						options: 'File',
						reqd: 1
					}
				],
				primary_action_label: __('Tabloya Ekle'),
				primary_action: ({ folder }) => {
					harpiya.db.get_list('File', {
						fields: ['file_url', 'file_name'],
						filters: {
							folder: folder
						}
					}).then(images => {
						frm.doc.images = frm.doc.images || [];
						images.forEach(image => {
							console.log(image)
							var new_row = frm.add_child("images");
							new_row.image = image.file_url
						});

						frm.refresh_field('images');
						d.hide();
					});
				}
			});

			d.show();
		})
	},
});
