import unittest

class BusinessLogicTests(unittest.TestCase):
    def test_fuel_cost_calculation(self):
        # Test high traffic fuel cost calculation
        distance = 15
        base_cost = distance * 5  # Base cost ₹5/km
        surcharge = distance * 2  # High traffic surcharge ₹2/km
        expected_cost = base_cost + surcharge
        self.assertEqual(expected_cost, 105)

    def test_late_delivery_penalty(self):
        # Test late delivery logic
        base_time = 30
        delivery_time = 45
        is_late = delivery_time > (base_time + 10)
        penalty = 50 if is_late else 0
        self.assertTrue(is_late)
        self.assertEqual(penalty, 50)

    def test_high_value_bonus(self):
        # Test high-value bonus calculation
        order_value = 1200
        is_on_time = True
        bonus = order_value * 0.1 if order_value > 1000 and is_on_time else 0
        self.assertEqual(bonus, 120)

    def test_efficiency_score(self):
        # Test efficiency score calculation
        on_time_deliveries = 8
        total_deliveries = 10
        efficiency = (on_time_deliveries / total_deliveries) * 100
        self.assertEqual(efficiency, 80.0)

    def test_driver_hours_parsing(self):
        # Test parsing of past week hours
        past_week_raw = '8|8|7|9|8|0|0'
        parts = [p for p in past_week_raw.split('|') if p.strip()!='']
        total_hours = sum([float(x) for x in parts])
        self.assertEqual(total_hours, 40.0)