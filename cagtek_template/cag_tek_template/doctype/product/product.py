# Copyright (c) 2021, Harpiya Software Technologies

import harpiya
from harpiya.website.website_generator import WebsiteGenerator
from harpiya.utils import is_markdown, markdown, cint
from harpiya.website.utils import get_comment_list
from harpiya import _


class Product(WebsiteGenerator):
    def validate(self):
        self.set_route()

    def set_route(self):
        """Set route from category and title if missing"""
        if not self.route:
            self.route = '/'.join([harpiya.get_value('Product Category', self.product_category, 'route'),
                                   self.scrub(self.title)])

    def on_update(self):
        self.update_category()
        clear_cache()

    def update_category(self):
        cnt = harpiya.db.sql("""select count(*) from `tabProduct`
			where product_category=%s and ifnull(published,0)=1""", self.product_category)[0][0]
        cat = harpiya.get_doc("Product Category", self.product_category)
        cat.product = cnt
        cat.save()

    def get_context(self, context):
        gallery = harpiya.get_doc("Website Slideshow", self.images)
        dolap = harpiya.get_doc("Product Variant", self.dolap_variant)
        aski = harpiya.get_doc("Product Variant", self.aski_variant)

        context.dolap_variant = dolap.get({"doctype": "Product Variant Items"})
        context.aski_variant = aski.get({"doctype": "Product Variant Items"})

        context.dolap = dolap
        context.aski = aski

        context.images = gallery.get({"doctype": "Website Slideshow Item"})
        context.product_category = harpiya.get_doc('Product Category', self.product_category)
        context.parents = self.get_parents(context)

    def get_parents(self, context):
        return [{"title": context.product_category.title, "route": context.product_category.route}]


def get_list_context(context=None):
    filters = dict(published=1)

    category = harpiya.db.get_value("Product Category", {"route": harpiya.local.path})

    if category:
        filters['product_category'] = category

    list_context = harpiya._dict(
        title=category or _("Ürünler"),
        hide_filters=True,
        filters=filters,
        category=harpiya.local.form_dict.category,
        no_breadcrumbs=False
    )

    if harpiya.local.form_dict.txt:
        list_context.blog_subtitle = _('"{0}" tarafından filtrelendi').format(harpiya.local.form_dict.txt)

    return list_context


def clear_cache():
    from harpiya.website.utils import clear_cache
    clear_cache()
