import harpiya
from harpiya.website.website_generator import WebsiteGenerator
from harpiya.website.utils import clear_cache


class ProductCategory(WebsiteGenerator):
    def autoname(self):
        # to override autoname of WebsiteGenerator
        self.name = self.scrub(self.title)

    def on_update(self):
        clear_cache()

    def set_route(self):
        # Override blog route since it has to been templated
        self.route = 'product/' + self.name
