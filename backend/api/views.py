from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Route, Order, Driver, SimulationResult
from .serializers import RouteSerializer, OrderSerializer, DriverSerializer, SimulationResultSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = []

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = []

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = []

@api_view(['POST'])
def register(request):
    try:
        from accounts.models import User
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('full_name', '')
        
        if not username or not password or not email:
            return Response({'error': 'Username, email and password required'}, status=400)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)
        
        user = User.objects.create_user(
            username=username, 
            email=email, 
            password=password,
            full_name=full_name or username,
            phone=request.data.get('phone', ''),
            role=request.data.get('role', 'customer'),
            company=request.data.get('company', ''),
            address=request.data.get('address', ''),
            city=request.data.get('city', ''),
            country=request.data.get('country', ''),
            postal_code=request.data.get('postal_code', '')
        )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User created successfully',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def login(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not password:
            return Response({'error': 'Password required'}, status=400)
        
        if not username and not email:
            return Response({'error': 'Username or email required'}, status=400)
        
        # Try authentication with username or email
        user = None
        if email:
            try:
                from accounts.models import User
                user_obj = User.objects.get(email=email)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                pass
        
        if not user and username:
            try:
                from accounts.models import User
                user_obj = User.objects.get(username=username)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                pass
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token), 
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': getattr(user, 'full_name', user.username),
                    'role': getattr(user, 'role', 'customer')
                },
                'message': 'Login successful'
            })
        return Response({'error': 'Invalid credentials'}, status=401)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    orders = Order.objects.all()
    
    total_profit = 0
    on_time = 0
    late = 0
    fuel_cost = 0
    
    for order in orders:
        route = order.route
        delivery_time = order.delivery_time_min or 0
        base_time = route.base_time_min
        
        profit = order.value_rs
        
        # Late delivery penalty
        if delivery_time > base_time + 10:
            profit -= 50
            late += 1
        else:
            on_time += 1
            # High-value bonus
            if order.value_rs > 1000:
                profit += order.value_rs * 0.1
        
        # Fuel cost
        route_fuel = route.distance_km * 5
        if route.traffic_level == 'High':
            route_fuel += route.distance_km * 2
        fuel_cost += route_fuel
        profit -= route_fuel
        
        total_profit += profit
    
    efficiency = (on_time / max(on_time + late, 1)) * 100
    
    fuel_breakdown = []
    for route in Route.objects.all():
        base_cost = route.distance_km * 5
        if route.traffic_level == 'High':
            base_cost += route.distance_km * 2
        fuel_breakdown.append({
            'route_id': route.route_id,
            'fuel_cost': base_cost,
            'traffic_level': route.traffic_level
        })
    
    return Response({
        'total_profit': round(total_profit, 2),
        'efficiency_score': round(efficiency, 2),
        'on_time_deliveries': on_time,
        'late_deliveries': late,
        'fuel_cost_breakdown': fuel_breakdown
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_simulation(request):
    try:
        num_drivers = int(request.data.get('num_drivers', 3))
        start_time = request.data.get('start_time', '09:00')
        max_hours = int(request.data.get('max_hours', 8))
        
        if num_drivers <= 0 or max_hours <= 0:
            return Response({'error': 'Invalid parameters'}, status=400)
        
        drivers = list(Driver.objects.all()[:num_drivers])
        orders = Order.objects.all()
        
        if not drivers:
            return Response({'error': 'No drivers available. Please add drivers first.'}, status=400)
        if not orders:
            return Response({'error': 'No orders available. Please add orders first.'}, status=400)
        
        total_profit = 0
        on_time = 0
        late = 0
        fuel_cost = 0
        
        for i, order in enumerate(orders):
            driver = drivers[i % len(drivers)]
            route = order.route
            
            delivery_time = route.base_time_min
            if driver and driver.total_past_week_hours() > 56:
                delivery_time *= 1.3
            
            profit = order.value_rs
            
            if delivery_time > route.base_time_min + 10:
                profit -= 50
                late += 1
            else:
                on_time += 1
                if order.value_rs > 1000:
                    profit += order.value_rs * 0.1
            
            route_fuel = route.distance_km * 5
            if route.traffic_level == 'High':
                route_fuel += route.distance_km * 2
            fuel_cost += route_fuel
            profit -= route_fuel
            
            total_profit += profit
        
        efficiency = (on_time / max(on_time + late, 1)) * 100
        
        SimulationResult.objects.create(
            num_drivers=num_drivers,
            start_time=start_time,
            max_hours=max_hours,
            total_profit=total_profit,
            efficiency_score=efficiency,
            on_time_deliveries=on_time,
            late_deliveries=late,
            total_fuel_cost=fuel_cost
        )
        
        return Response({
            'total_profit': round(total_profit, 2),
            'efficiency_score': round(efficiency, 2),
            'on_time_deliveries': on_time,
            'late_deliveries': late,
            'total_fuel_cost': round(fuel_cost, 2)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def simulation_history(request):
    results = SimulationResult.objects.all().order_by('-timestamp')[:10]
    serializer = SimulationResultSerializer(results, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def test_connection(request):
    try:
        from .models import Driver, Route, Order
        return Response({
            'status': 'Backend is running',
            'drivers_count': Driver.objects.count(),
            'routes_count': Route.objects.count(),
            'orders_count': Order.objects.count()
        })
    except Exception as e:
        return Response({
            'status': 'Backend running but DB error',
            'error': str(e)
        })

@api_view(['GET'])
def simple_test(request):
    return Response({'message': 'Django is working'})