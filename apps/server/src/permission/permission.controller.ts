import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionService } from './permission.service';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('menus')
  menus(@CurrentUser() user: { id: string }) {
    return this.permissionService.getMenus(user.id);
  }

  @Get('codes')
  codes(@CurrentUser() user: { id: string }) {
    return this.permissionService.getCodes(user.id);
  }
}
