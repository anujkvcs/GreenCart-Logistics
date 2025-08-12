from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Route, Order, Driver

class APITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='test', password='test')
        
    def test_register(self):
        response = self.client.post('/api/auth/register/', {'username': 'new', 'password': 'new'})
        self.assertEqual(response.status_code, 200)
        
    def test_login(self):
        response = self.client.post('/api/auth/login/', {'username': 'test', 'password': 'test'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        
    def test_dashboard_unauthorized(self):
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, 401)
        
    def test_simulation_business_rules(self):
        route = Route.objects.create(route_id=1, distance_km=10, traffic_level='High', base_time_min=60)
        order = Order.objects.create(order_id=1, value_rs=1500, route=route, delivery_time_min=65)
        
        # Login
        response = self.client.post('/api/auth/login/', {'username': 'test', 'password': 'test'})
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test dashboard
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, 200)
        
    def test_simulation_run(self):
        route = Route.objects.create(route_id=1, distance_km=10, traffic_level='Low', base_time_min=60)
        Order.objects.create(order_id=1, value_rs=500, route=route, delivery_time_min=50)
        Driver.objects.create(name='Test Driver', shift_hours=8, past_week_hours_raw='8|8|8|8|8|0|0')
        
        response = self.client.post('/api/auth/login/', {'username': 'test', 'password': 'test'})
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.post('/api/simulation/run/', {
            'num_drivers': 1,
            'start_time': '09:00',
            'max_hours': 8
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('total_profit', response.data)