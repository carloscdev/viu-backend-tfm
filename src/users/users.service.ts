import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { handleError } from 'src/utils/handleError';
import { LoginUserDto } from './dto/login-user.dto';
import { comparePassword, encryptPassword } from 'src/utils/handleBcrypt';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto, UpdateProfileDto } from './dto/update-user.dto';
import { MailsService } from 'src/mails/mails.service';
import { UserRole } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailsService,
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
      handleError(error, 'Register User');
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
        throw new BadRequestException('Credenciales no válidas');
      }

      if (!user.isActive) {
        throw new BadRequestException(
          'Usuario inactivo, contacte con el administrador',
        );
      }

      if (user.isDeleted) {
        throw new BadRequestException('Usuario eliminado');
      }

      delete user['password'];

      return {
        message: 'Logueado correctamente',
        token: this.getJwtToken({ userId: user.userId }),
      };
    } catch (error) {
      handleError(error, 'Login User');
    }
  }

  async getUsers() {
    try {
      const users = await this.userRepository.find({
        where: {
          isDeleted: false,
        },
        order: {
          userId: 'DESC',
        },
      });
      return users;
    } catch (error) {
      handleError(error, 'Get Users');
    }
  }

  async getProfile(user: User) {
    try {
      const profile = await this.userRepository.findOne({
        where: { userId: user.userId },
      });
      if (!profile) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      return profile;
    } catch (error) {
      handleError(error, 'Get Profile');
    }
  }

  async updateProfile(user: User, body: UpdateProfileDto) {
    try {
      const { userId } = user;
      const { name, email } = body;
      const profile = await this.userRepository.findOneBy({ userId });

      if (!profile) {
        throw new UnauthorizedException('No se puede actualizar el perfil');
      }
      profile.name = name;
      profile.email = email;
      await this.userRepository.save(profile);
      this.mailService.sendMailUpdate(
        user,
        'Tu perfil ha sido actualizado correctamente.',
      );
      return profile;
    } catch (error) {
      handleError(error, 'Update Profile');
    }
  }

  async activeUser(userId: number, body: { isActive: boolean }) {
    try {
      const { isActive } = body;
      const user = await this.userRepository.findOneBy({ userId });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      console.log(user.isActive, isActive);
      user.isActive = isActive;
      await this.userRepository.save(user);
      this.mailService.sendMailUpdate(user, 'Tu cuenta ha sido actualizada.');
      return user;
    } catch (error) {
      handleError(error, 'Active User');
    }
  }

  async updateRolUser(userId: number, body: { role: UserRole }) {
    try {
      const { role } = body;
      const user = await this.userRepository.findOneBy({ userId });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      user.role = role;
      await this.userRepository.save(user);
      this.mailService.sendMailUpdate(user, 'Tu rol ha sido actualizado.');
      return user;
    } catch (error) {
      handleError(error, 'Update Rol User');
    }
  }

  async updatePassword(user: User, body: UpdatePasswordDto) {
    try {
      const { userId, email } = user;
      const { password, newPassword, confirmPassword } = body;
      const currentUser = await this.userRepository.findOne({
        where: { userId, email },
        select: {
          password: true,
          isActive: true,
        },
      });
      if (
        !currentUser ||
        !(await comparePassword(password, currentUser.password))
      ) {
        throw new UnauthorizedException('No se pudo actualizar la contraseña');
      }

      if (!currentUser.isActive) {
        throw new BadRequestException(
          'Usuario inactivo, contacte con el administrador',
        );
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }
      const updateUser = await this.userRepository.findOneBy({ userId });
      updateUser.password = await encryptPassword(newPassword);
      await this.userRepository.save(updateUser);
      this.mailService.sendMailUpdate(
        user,
        'Tu contraseña ha sido actualizado correctamente.',
      );
      return {
        statusCode: 200,
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      handleError(error, 'Update Password');
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
