// Copyright (c) 2021, Harpiya Software Technologies

harpiya.ui.form.on("Product Variant", {
	refresh: (frm) => {
		let intro = frm.doc.__islocal?
			__("Önce adı ayarlayın ve kaydı kaydedin.") : __("Dosyaları/Bağlantıları ekleyin ve tabloya ekleyin.");
		frm.set_intro(intro);

		if (frm.is_new()) return;

		frm.add_custom_button(__('Belgeden ekli resimleri getir'), () => {
			const d = new harpiya.ui.Dialog({
				title: __('Resimleri Getir'),
				fields: [
					{
						label: __('Belge Türü'),
						fieldtype: 'Link',
						fieldname: 'reference_doctype',
						options: 'DocType',
						reqd: 1
					},
					{
						label: __('Adı'),
						fieldtype: 'Dynamic Link',
						fieldname: 'reference_name',
						options: 'reference_doctype',
						reqd: 1
					}
				],
				primary_action_label: __('Tabloya Ekle'),
				primary_action: ({ reference_doctype, reference_name }) => {
					harpiya.db.get_list('File', {
						fields: ['file_url'],
						filters: {
							attached_to_doctype: reference_doctype,
							attached_to_name: reference_name
						}
					}).then(images => {
						frm.doc.variant_items = frm.doc.variant_items || [];
						images.forEach(image => {
							frm.doc.variant_items.push({
								image: image.file_url,
							});
						});

						frm.refresh_field('variant_items');
						d.hide();
					});
				}
			});

			d.show();
		})
	}
})
