from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from auth_service.models import CustomUser

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for API testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating test users...')
        
        # Create a manager
        manager, created = CustomUser.objects.get_or_create(
            username='manager1',
            defaults={
                'email': 'manager1@example.com',
                'role': 'manager',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            manager.set_password('12345')
            manager.save()
            self.stdout.write(self.style.SUCCESS(f'Created manager: {manager.username}'))
        else:
            manager.set_password('12345')
            manager.save()
            self.stdout.write(self.style.SUCCESS(f'Updated manager: {manager.username}'))
        
        # Create employees
        employee1, created = CustomUser.objects.get_or_create(
            username='employee1',
            defaults={
                'email': 'employee1@example.com',
                'role': 'employee',
                'manager': manager
            }
        )
        if created:
            employee1.set_password('12345')
            employee1.save()
            self.stdout.write(self.style.SUCCESS(f'Created employee: {employee1.username}'))
        else:
            employee1.set_password('12345')
            employee1.save()
            self.stdout.write(self.style.SUCCESS(f'Updated employee: {employee1.username}'))
        
        employee2, created = CustomUser.objects.get_or_create(
            username='employee2',
            defaults={
                'email': 'employee2@example.com',
                'role': 'employee',
                'manager': manager
            }
        )
        if created:
            employee2.set_password('12345')
            employee2.save()
            self.stdout.write(self.style.SUCCESS(f'Created employee: {employee2.username}'))
        else:
            employee2.set_password('12345')
            employee2.save()
            self.stdout.write(self.style.SUCCESS(f'Updated employee: {employee2.username}'))
        
        self.stdout.write(self.style.SUCCESS('Test users created successfully!'))
        self.stdout.write('Login credentials:')
        self.stdout.write('Manager: username=manager1, password=12345')
        self.stdout.write('Employee1: username=employee1, password=12345')
        self.stdout.write('Employee2: username=employee2, password=12345') 