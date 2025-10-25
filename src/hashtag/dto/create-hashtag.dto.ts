import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHashtagDto{
    @IsNotEmpty()
    @IsString()
    name:string

    @IsOptional()
    @IsArray()
    @IsInt()
    tweet:number[]
}