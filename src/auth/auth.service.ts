import { Injectable, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config/dist/types';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=>UsersService))
        private readonly userService:UsersService,
        private readonly hashingProvider:HashingProvider,
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,
        private readonly jwtService:JwtService
    ){}

        public async login(loginDto:LoginDto){
            // find the user with username
            let user  = await this.userService.findbyUsername(loginDto.userName)
            

            //compare password
            let isEqual:boolean = false

            isEqual = await this.hashingProvider.comparePassword(loginDto.password, user.password)

            // //if password match, login user

            if(!isEqual){
                throw new UnauthorizedException('Incorrect password')
            }


            //generate jwt and send it in the response

           return await this.generateToken(user)  
        }

    public async userLogin(createDto:CreateUserDto){
        return await this.userService.createUser(createDto)
    }

    public async RefreshToken(refreshTokenDto:RefreshTokenDto){
        try {
             //verify the refresh token
        const {sub} = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
            secret:this.authConfiguration.secret,
            audience:this.authConfiguration.audience,
            issuer:this.authConfiguration.issuer
        })

        // find the user from the db using the user id

        const user = await this.userService.FindUserById(sub)

        //generate an access token and refresh token
        return await this.generateToken(user)


        } catch (error) {
            throw new UnauthorizedException(error)
        }
       
    }


    private async signToken<T>(userId:number,expiresIn:number, payload?: T){
         return await this.jwtService.signAsync({
                sub:userId,
                ...payload
            }, {
                secret:this.authConfiguration.secret,
                expiresIn:expiresIn,
                audience:this.authConfiguration.audience,
                issuer:this.authConfiguration.issuer
            })
    }

    private async generateToken(user:User){
        //generate an access token
        const accessToken = await this.signToken<Partial<ActiveUserType>>(user.id, this.authConfiguration.expiresIn,{email:user.email})

        //generate refresh token
                const refreshToken = await this.signToken<Partial<ActiveUserType>>(user.id, this.authConfiguration.expiresIn)

                return {
                    token:accessToken,
                    refreshToken
                }

    }
}
