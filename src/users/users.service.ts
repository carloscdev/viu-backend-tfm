import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { handleError } from 'src/utils/handleError';
import { LoginUserDto } from './dto/login-user.dto';
import { comparePassword } from 'src/utils/handleBcrypt';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { passwordConfirm, ...body } = createUserDto;
      if (body.password !== passwordConfirm) {
        throw new Error('Las contraseñas no coinciden');
      }
      const user = this.userRepository.create(body);
      await this.userRepository.save(user);
      return {
        message: 'Registrado correctamente',
        token: this.getJwtToken({ userId: user.userId }),
      };
    } catch (error) {
      handleError(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: {
          userId: true,
          email: true,
          password: true,
          isActive: true,
          isDeleted: true,
        },
      });

      if (!user || !(await comparePassword(password, user.password))) {
        throw new UnauthorizedException('Credenciales no válidas');
      }

      if (!user.isActive) {
        throw new UnauthorizedException(
          'Usuario inactivo, contacte con el administrador',
        );
      }

      if (user.isDeleted) {
        throw new UnauthorizedException('Usuario eliminado');
      }

      delete user['password'];

      return {
        message: 'Logueado correctamente',
        token: this.getJwtToken({ userId: user.userId }),
      };
    } catch (error) {
      handleError(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
