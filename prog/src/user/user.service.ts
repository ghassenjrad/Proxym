import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from '../reservation/reservation.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    jwtService: any;
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
    ) { }

    // Register a new user
    async register(userDto: UserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where:
                { email: userDto.email }
        });
        console.log(existingUser);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password, salt);

        const newUser = this.userRepository.create(userDto);
        console.log('new user', newUser);
        return this.userRepository.save(newUser);
    }


    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where:
                { email: email }
        });
    }

    async savePasswordResetToken(userId: number, token: string, expires: Date) {
        await this.userRepository.update(userId, { resetToken: token, resetTokenExpires: expires });
    }

    async findByResetToken(token: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                resetToken: token,
                resetTokenExpires: MoreThan(new Date()),
            },
        });
    }

    async updatePassword(userId: number, newPassword: string) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.userRepository.update(userId, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null
        });
    }
}
