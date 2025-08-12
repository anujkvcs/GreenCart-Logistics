from rest_framework import serializers
from .models import Route, Order, Driver, SimulationResult

class RouteSerializer(serializers.ModelSerializer):
    class Meta: model = Route; fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    route_id = serializers.IntegerField(source='route.route_id', read_only=True)
    assigned_driver_name = serializers.CharField(source='assigned_driver.name', read_only=True)
    class Meta: 
        model = Order
        fields = ['order_id','value_rs','route','route_id','delivery_time_min','assigned_driver','assigned_driver_name']

class DriverSerializer(serializers.ModelSerializer):
    total_past_week_hours = serializers.SerializerMethodField()
    class Meta: model = Driver; fields = ['id','name','shift_hours','past_week_hours_raw','total_past_week_hours']
    def get_total_past_week_hours(self, obj): return obj.total_past_week_hours()

class SimulationResultSerializer(serializers.ModelSerializer):
    class Meta: model = SimulationResult; fields = '__all__'