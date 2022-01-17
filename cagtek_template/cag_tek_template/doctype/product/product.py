# Copyright (c) 2021, Harpiya Software Technologies

import harpiya
from harpiya import _
from harpiya.website.website_generator import WebsiteGenerator
from harpiya.website.utils import clear_cache
from harpiya.utils import today, cint, global_date_format, get_fullname, strip_html_tags, markdown, sanitize_html
from math import ceil
from harpiya.website.utils import (find_first_image, get_html_content_based_on_type,
                                   get_comment_list)


class Product(WebsiteGenerator):
    def validate(self):
        self.set_route()

    @harpiya.whitelist()
    def make_route(self):
        if not self.route:
            return harpiya.db.get_value('Product Category', self.product_category,
                                        'route') + '/' + self.scrub(self.title)

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
        dolap = harpiya.get_doc("Product Variant", self.dolap_variant) if self.dolap_variant else ""
        aski = harpiya.get_doc("Product Variant", self.aski_variant) if self.aski_variant else ""

        if dolap:
            context.dolap_variant = dolap.get({"doctype": "Product Variant Items"})
            context.dolap = dolap
        if aski:
            context.aski_variant = aski.get({"doctype": "Product Variant Items"})
            context.aski = aski

        context.images = harpiya.get_all("Product Image Item", filters=dict(parent=self.name), fields=['image'])

        context.category = harpiya.get_doc('Product Category', self.product_category)

        context.parents = self.get_parents(context)

    def get_parents(self, context):
        return [{"label": _("Anasayfa"), "route": "/"},
                {"label": _("Ürünler"), "route": "/product"},
                {"label": get_product_category(context.product_category), "route": context.category.route}]


def get_list_context(context=None):
    list_context = harpiya._dict(
        get_list=get_product_list,
        no_breadcrumbs=False,
        hide_filters=True,
        # show_search = True,
        title=_('Ürünler')
    )

    category = harpiya.utils.escape_html(harpiya.local.form_dict.product_category or harpiya.local.form_dict.category)
    if category:
        category_title = get_product_category(category)
        list_context.sub_title = _("Posts filed under {0}").format(category_title)
        list_context.title = category_title

    elif harpiya.local.form_dict.txt:
        list_context.sub_title = _('Filtered by "{0}"').format(sanitize_html(harpiya.local.form_dict.txt))

    if list_context.sub_title:
        list_context.parents = [{"label": _("Anasayfa"), "route": "/"},
                                {"label": _("Ürünler"), "route": "/product"}]
    else:
        list_context.parents = [{"label": _("Anasayfa"), "route": "/"}]

    return list_context


def get_product_category(route):
    return harpiya.db.get_value("Product Category", {"name": route}, "title") or route


def get_product_list(doctype, txt=None, filters=None, limit_start=0, limit_page_length=20, order_by=None):
    conditions = []
    category = filters.product_category or harpiya.utils.escape_html(
        harpiya.local.form_dict.product_category or harpiya.local.form_dict.category)

    if category:
        conditions.append('t1.product_category=%s' % harpiya.db.escape(category))

    if txt:
        conditions.append('(t1.content like {0} or t1.title like {0}")'.format(harpiya.db.escape('%' + txt + '%')))

    if conditions:
        harpiya.local.no_cache = 1

    query = """\
        select
            t1.title, t1.name, t1.product_category, t1.route,
                t1.code as code,
                t1.product_image as product_image
        from `tabProduct` t1
        where ifnull(t1.published,0)=1
        %(condition)s
        order by name asc
        limit %(page_len)s OFFSET %(start)s""" % {
        "start": limit_start, "page_len": limit_page_length,
        "condition": (" and " + " and ".join(conditions)) if conditions else ""
    }

    products = harpiya.db.sql(query, as_dict=1)

    for product in products:
        product.product_image = product.product_image
        product.category = harpiya.db.get_value('Product Category', product.product_category,
                                                ['name', 'route', 'title'], as_dict=True)

    return products
