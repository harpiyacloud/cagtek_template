# Copyright (c) 2022, Harpiya Software Technologies and contributors

import harpiya
from harpiya import _

from harpiya.model.document import Document

class ProductVariant(Document):
	def validate(self):
		self.validate_images()

	def on_update(self):
		# a product variant can be in use and any change in it should get reflected
		from harpiya.website.utils import clear_cache
		clear_cache()

	def validate_images(self):
		""" atleast one image file should be public for product variant """
		files = map(lambda row: row.image, self.variant_items)
		if files:
			result = harpiya.get_all("File", filters={"file_url": ("in", list(files))}, fields="is_private")
			if any(file.is_private for file in result):
				harpiya.throw(_("Ürün varyantına eklenen tüm görseller herkese açık olmalı."))


def get_variants(doc):
	if not doc.product_variant:
		return {}

	product_variant = harpiya.get_doc("Ürün Varyantı", doc.product_variant)

	return {
		"variants": product_variant.get({"doctype": "Ürün Varyant Öğesi"}),
	}
