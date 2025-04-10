import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
    ) { }

    async findAll(): Promise<Device[]> {
        return this.deviceRepository.find();
    }

    async findById(id: number): Promise<Device> {
        const device = await this.deviceRepository.findOne({
            where:
                { id: id }
        });
        if (!device) {
            throw new NotFoundException(`Device with ID ${id} not found`);
        }
        return device;
    }

    async findByName(name: string) {
        const device = await this.deviceRepository.findOne({
            where:
                { name: name }
        });
        if (!device) {
            throw new NotFoundException("Device not found");
        }
        return device
    }

    async create(deviceData: Partial<Device>): Promise<Device> {
        const { name, type, state, description } = deviceData;
        const newDevice = this.deviceRepository.create({ name, type, state, description });
        return this.deviceRepository.save(newDevice);
    }


    async delete(id: number): Promise<void> {
        await this.deviceRepository.delete(id);
    }
}
