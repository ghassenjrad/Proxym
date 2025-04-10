import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

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
}
