import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @AllowAnonymous()
    @Post('login')
    @HttpCode(HttpStatus.OK)
     login(@Body() loginDto:LoginDto){
        return this.authService.login(loginDto)
    } 

    @AllowAnonymous()
    @Post('signup')
    signup(@Body() user: CreateUserDto) {
        
        return this.authService.userLogin(user)
    }


    @AllowAnonymous()
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    public async refreshToken(@Body() refreshTokenDto:RefreshTokenDto){
        return await this.authService.RefreshToken(refreshTokenDto)
    }

}
