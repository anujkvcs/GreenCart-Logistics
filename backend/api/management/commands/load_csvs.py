from django.core.management.base import BaseCommand
from api.models import Route, Order, Driver
import csv
import os

class Command(BaseCommand):
    def handle(self, *args, **options):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        data_dir = os.path.join(base_dir, 'data')
        
        # Load routes
        with open(os.path.join(data_dir, 'routes.csv'), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                Route.objects.get_or_create(
                    route_id=int(row['route_id']),
                    defaults={
                        'distance_km': float(row['distance_km']),
                        'traffic_level': row['traffic_level'],
                        'base_time_min': int(row['base_time_min'])
                    }
                )
        
        # Load drivers
        with open(os.path.join(data_dir, 'drivers.csv'), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                Driver.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'shift_hours': int(row['shift_hours']),
                        'past_week_hours_raw': row['past_week_hours']
                    }
                )
        
        # Load orders
        with open(os.path.join(data_dir, 'orders.csv'), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                route = Route.objects.get(route_id=int(row['route_id']))
                time_parts = row['delivery_time'].split(':')
                delivery_min = int(time_parts[0]) * 60 + int(time_parts[1])
                Order.objects.get_or_create(
                    order_id=int(row['order_id']),
                    defaults={
                        'value_rs': int(row['value_rs']),
                        'route': route,
                        'delivery_time_min': delivery_min
                    }
                )
        
        self.stdout.write('Data loaded successfully')