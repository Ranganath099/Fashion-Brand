from django.contrib import admin
from .models import Collection

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_new")
    list_filter = ("is_new",)
    prepopulated_fields = {"slug": ("name",)}
