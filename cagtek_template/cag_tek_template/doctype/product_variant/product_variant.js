// Copyright (c) 2021, Harpiya Software Technologies

harpiya.ui.form.on("Product Variant", {
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
						frm.doc.variant_items = frm.doc.variant_items || [];
						images.forEach(image => {
							console.log(image)
							var new_row = frm.add_child("variant_items");
							new_row.image = image.file_url
						});

						frm.refresh_field('variant_items');
						d.hide();
					});
				}
			});

			d.show();
		})
	},
})
