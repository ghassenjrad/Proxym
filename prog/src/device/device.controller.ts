import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';

@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('/devices')
    create(@Body() deviceData: Partial<Device>): Promise<Device> {
        return this.deviceService.create(deviceData);
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



    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.deviceService.delete(+id);
    }
}
