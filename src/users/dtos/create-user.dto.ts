import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { CreateProfileDto } from "src/profile/dto/create-profile.dto"

export class CreateUserDto {

    @IsNotEmpty()
    @MaxLength(24)
    userName: string


    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string


    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MinLength(8)
    @MaxLength(100)
    password: string


    @IsOptional()
    profile?:CreateProfileDto | null
}