import { Logger, Module } from '@nestjs/common';
import { UserService } from './application/services/user.service';
import { AUTH_SERVICE, ROLE_REPOSITORY, ROLE_SERVICE, USER_REPOSITORY, USER_SERVICE } from '../common/constant';
import { UserRepository } from './infrastructure/presistence/user.repository';
import { User } from './domain/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/user.controller';
import { RoleController } from './presentation/role.controller';
import { RoleService } from './application/services/role.service';
import { RoleRepository } from './infrastructure/presistence/role.repository';
import { Role } from './domain/role';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/auth.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UserController, RoleController, AuthController],
    providers: [
        {
            provide: USER_SERVICE,
            useClass: UserService,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: ROLE_SERVICE,
            useClass: RoleService,
        },
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleRepository,
        },
        {
            provide: AUTH_SERVICE,
            useClass: AuthService,
        },
    ],
    exports: [USER_REPOSITORY, ROLE_REPOSITORY],
})
export class AccountModule { }
