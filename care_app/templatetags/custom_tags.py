from django import template
from care_app.utils import get_vite_asset_path

register = template.Library()

@register.simple_tag
def vite_asset(asset):
    return get_vite_asset_path(asset)
