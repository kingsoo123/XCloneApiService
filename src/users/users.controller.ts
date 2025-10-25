import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";



@Controller('users')
//@UseGuards(AuthorizeGuard)
export class UsersController {
    constructor(private usersService:UsersService){
    }


   
    @Get()
    getUsers(@Query() paginationQueryDto:PaginationQueryDto) {     
        return this.usersService.getAllUsers(paginationQueryDto)
    }


    @Delete(':id')
    deleteUserById(@Param('id', ParseIntPipe) id:number){
        return this.usersService.deleteUser(id)
    }
}