from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now


class UserScans(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    daily_scans = models.PositiveIntegerField(default=0)
    bought_scans = models.PositiveIntegerField(default=0)
    last_updated = models.DateField(default=now)

    def update_daily_scans(self):
        """Reset daily scans if the day has changed."""
        if self.last_updated != now().date():
            self.daily_scans = 0
            self.last_updated = now().date()
            self.save()

    def consume_scan(self):
        """Consume a scan if available, prioritize daily scans over bought scans."""
        self.update_daily_scans()
        if self.daily_scans < 2:
            self.daily_scans += 1
        elif self.bought_scans > 0:
            self.bought_scans -= 1
        else:
            raise ValueError("No scans available")
        self.save()

    def add_bought_scans(self, count):
        """Add a specified number of bought scans."""
        self.bought_scans += count
        self.save()

    def get_available_scans(self):
        """
        Get the total number of scans available:
        - Daily scans remaining today.
        - Bought scans remaining.
        """
        self.update_daily_scans()
        remaining_daily_scans = max(0, 2 - self.daily_scans)
        return {
            "daily_scans_left": remaining_daily_scans,
            "bought_scans_left": self.bought_scans,
            "total_scans_left": remaining_daily_scans + self.bought_scans,
        }

    @classmethod
    def create_new_user(cls, user):
        """Create a new user record with default daily scans."""
        return cls.objects.create(user=user, daily_scans=0, bought_scans=0)

