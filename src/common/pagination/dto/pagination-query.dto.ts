import { IsOptional, IsPositive } from "class-validator"

export class PaginationQueryDto{
    @IsPositive()
    @IsOptional()
    limit?:number = 10;

    @IsPositive()
    @IsOptional()
    page?:number = 1;
}//Type transformation was used here because the type is number but since query data type is a strirng
//we trasnformed the type to number from main.ts file