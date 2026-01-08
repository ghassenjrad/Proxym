import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    //@HttpCode(HttpStatus.CREATED)
    async register(
        @Body() userDto: UserDto
    ) {
        return this.userService.register(userDto);
    }


    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // Admin: create user with role
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('create-with-role')
    async createWithRole(@Body() userDto: UserDto) {
        return this.userService.createWithRole(userDto);
    }

    // Admin: set user role
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id/role')
    async setRole(@Param('id') id: string, @Body('role') role: string) {
        return this.userService.setUserRole(id, role);
    }
}
