from rest_framework import serializers
from .models import Product,ProductImage
from collection.models import Collection

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "name", "slug"]

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "is_primary"]



class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    collection = CollectionSerializer(read_only=True) 
    class Meta:
        model = Product
        fields = "__all__"
