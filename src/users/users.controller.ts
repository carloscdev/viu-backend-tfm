import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from './interfaces/user.interface';
import { UpdateProfileDto, UpdatePasswordDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('/test')
  @Auth(UserRole.ADMIN)
  testingPrivateRoute(@GetUser('userId') user: User) {
    console.log({ user });
    return {
      statusCode: 200,
      message: 'Esta es una ruta privada',
    };
  }

  @Get('/profile')
  @Auth()
  getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user);
  }

  @Patch('/profile')
  @Auth()
  updateProfile(@GetUser() user: User, @Body() body: UpdateProfileDto) {
    return this.usersService.updateProfile(user, body);
  }

  @Patch('/password')
  @Auth()
  updatePassword(@GetUser() user: User, @Body() body: UpdatePasswordDto) {
    return this.usersService.updatePassword(user, body);
  }
}
