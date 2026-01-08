import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user.entity';


@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('/devices')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() deviceData: Partial<Device>) {
        return this.deviceService.create(deviceData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    delete(@Param('id') id: string): Promise<void> {
        return this.deviceService.delete(+id);
    }


    @Get()
    findAll(): Promise<Device[]> {
        return this.deviceService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Device> {
        return this.deviceService.findById(+id);
    }

    @Get('name/:name')
    findByName(@Param('name') name: string): Promise<Device> {
        return this.deviceService.findByName(name);
    }





}
