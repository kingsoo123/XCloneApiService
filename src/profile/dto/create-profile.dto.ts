import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateProfileDto{
        @IsString({ message: 'Name should be a string value' })
        @IsNotEmpty()
        @MinLength(3, { message: 'First name should have a minimum of 3 characters.' })
        @MaxLength(100)
        @IsOptional()
        firstName?: string
    
    
        @IsString({ message: 'Name should be a string value' })
        @IsNotEmpty()
        @MinLength(3, { message: 'Last name should have a minimum of 3 characters.' })
        @MaxLength(100)
        @IsOptional()
        lastName?: string
    
    
        @IsString()
        @IsOptional()
        @MaxLength(10)
        gender?: string


        @IsDate()
        @IsOptional()
        dateOfBirth?:Date

        @IsString()
        @IsOptional()
        bio?:string

        @IsString()
        @IsOptional()
        profileImage?:string
}


