# Copyright (c) 2022, Harpiya Software Technologies and contributors

import harpiya
from harpiya import _
from harpiya.website.website_generator import WebsiteGenerator


class EKatalog(WebsiteGenerator):
    def validate(self):
        self.set_route()

    def set_route(self):
        if not self.route:
            self.route = 'e-catalog/' + self.scrub(self.title)

    def on_update(self):
        super(EKatalog, self).on_update()
        clear_cache()

    def on_trash(self):
        super(EKatalog, self).on_trash()


def get_list_context(context):
    context.allow_guest = True
    context.no_cache = False
    context.show_sidebar = False
    context.title = _("E-Katalog")
    context.no_breadcrumbs = False
    context.parents = [{"label": _("Anasayfa"), "route": "/"}]


def clear_cache():
    from harpiya.website.utils import clear_cache
    clear_cache()