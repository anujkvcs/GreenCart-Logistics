from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'routes', views.RouteViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'drivers', views.DriverViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register),
    path('auth/login/', views.login),
    path('dashboard/', views.dashboard),
    path('simulation/run/', views.run_simulation),
    path('simulation/history/', views.simulation_history),
    path('test/', views.test_connection),
    path('simple-test/', views.simple_test),
]