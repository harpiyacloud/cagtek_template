from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in cagtek_template/__init__.py
from cagtek_template import __version__ as version

setup(
	name="cagtek_template",
	version=version,
	description="Cağ-Tek Website Theme",
	author="Harpiya Software Technologies",
	author_email="info@harpiya.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
