import { Controller, Get, UseGuards } from '@nestjs/common';
import { PERMISSION_CODES } from '@enterprise/shared';
import { Permission } from '../common/decorators/permission.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { SystemService } from './system.service';

@Controller('system')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('users')
  @Permission(PERMISSION_CODES.systemUserManage)
  users() {
    return this.systemService.users();
  }

  @Get('roles')
  @Permission(PERMISSION_CODES.systemRoleManage)
  roles() {
    return this.systemService.roles();
  }

  @Get('menus')
  @Permission(PERMISSION_CODES.systemMenuManage)
  menus() {
    return this.systemService.menus();
  }

  @Get('logs')
  @Permission(PERMISSION_CODES.systemLogRead)
  logs() {
    return this.systemService.logs();
  }

  @Get('settings')
  @Permission(PERMISSION_CODES.systemLogRead)
  settings() {
    return this.systemService.settings();
  }
}
