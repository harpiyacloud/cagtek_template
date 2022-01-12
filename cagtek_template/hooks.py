from . import __version__ as app_version

app_name = "cagtek_template"
app_title = "Cağ-Tek Template"
app_publisher = "Harpiya Software Technologies"
app_description = "Cağ-Tek Website Theme"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@harpiya.com"
app_license = "MIT"

website_route_rules = [
	{"from_route": "/product/<category>", "to_route": "Product"},
	{"from_route": "/e-catalog", "to_route": "E Katalog"},

]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/cagtek_template/css/cagtek_template.css"
# app_include_js = "/assets/cagtek_template/js/cagtek_template.js"

# include js, css files in header of web template
# web_include_css = "cagtek-web.bundle.css"
# web_include_js = "/assets/cagtek_template/js/cagtek_template.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "cagtek_template/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "cagtek_template.utils.jinja_methods",
# 	"filters": "cagtek_template.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "cagtek_template.install.before_install"
# after_install = "cagtek_template.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "cagtek_template.uninstall.before_uninstall"
# after_uninstall = "cagtek_template.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See harpiya.core.notifications.get_notification_config

# notification_config = "cagtek_template.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "harpiya.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "harpiya.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"cagtek_template.tasks.all"
# 	],
# 	"daily": [
# 		"cagtek_template.tasks.daily"
# 	],
# 	"hourly": [
# 		"cagtek_template.tasks.hourly"
# 	],
# 	"weekly": [
# 		"cagtek_template.tasks.weekly"
# 	],
# 	"monthly": [
# 		"cagtek_template.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "cagtek_template.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"harpiya.desk.doctype.event.event.get_events": "cagtek_template.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Harpiya apps
# override_doctype_dashboards = {
# 	"Task": "cagtek_template.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"cagtek_template.auth.validate"
# ]

