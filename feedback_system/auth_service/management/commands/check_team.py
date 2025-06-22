from django.core.management.base import BaseCommand
from auth_service.models import CustomUser

class Command(BaseCommand):
    help = 'Check team members for a manager'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Manager username')

    def handle(self, *args, **options):
        username = options['username']
        
        try:
            manager = CustomUser.objects.get(username=username)
            if manager.role != 'manager':
                self.stdout.write(self.style.ERROR(f'{username} is not a manager'))
                return
            
            team_members = manager.team_members.all()
            
            self.stdout.write(f'Manager: {manager.username} (ID: {manager.id})')
            self.stdout.write('Team Members:')
            
            if team_members:
                for member in team_members:
                    self.stdout.write(f'  - {member.username} (ID: {member.id}) - {member.email}')
            else:
                self.stdout.write('  No team members found')
                
        except CustomUser.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {username} not found')) 