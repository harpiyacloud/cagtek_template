import harpiya
from harpiya.website.website_generator import WebsiteGenerator
from harpiya.website.doctype.help_article.help_article import clear_cache

class ProductCategory(WebsiteGenerator):
	website = harpiya._dict(
		condition_field = "published",
		page_title_field = "title"
	)

	def before_insert(self):
		self.published=1

	def autoname(self):
		self.name = self.title

	def validate(self):
		self.set_route()

	def set_route(self):
		if not self.route:
			self.route = 'product/' + self.scrub(self.title)

	def on_update(self):
		clear_cache()
