from django.db import models
from django.contrib.auth.models import User

class Route(models.Model):
    route_id = models.IntegerField(primary_key=True)
    distance_km = models.FloatField()
    traffic_level = models.CharField(max_length=16)
    base_time_min = models.IntegerField()
    def __str__(self): return f"Route {self.route_id}"

class Driver(models.Model):
    name = models.CharField(max_length=64, unique=True)
    shift_hours = models.IntegerField()
    past_week_hours_raw = models.TextField(null=True, blank=True)
    def total_past_week_hours(self):
        if not self.past_week_hours_raw: return 0
        parts = [p for p in self.past_week_hours_raw.split('|') if p.strip()!='']
        return sum([float(x) for x in parts])
    def __str__(self): return self.name

class Order(models.Model):
    order_id = models.IntegerField(primary_key=True)
    value_rs = models.IntegerField()
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='orders')
    delivery_time_min = models.IntegerField(null=True, blank=True)
    assigned_driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self): return f"Order {self.order_id}"

class SimulationResult(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    num_drivers = models.IntegerField()
    start_time = models.CharField(max_length=10)
    max_hours = models.IntegerField()
    total_profit = models.FloatField()
    efficiency_score = models.FloatField()
    on_time_deliveries = models.IntegerField()
    late_deliveries = models.IntegerField()
    total_fuel_cost = models.FloatField()
    def __str__(self): return f"Simulation {self.id} - {self.timestamp}"