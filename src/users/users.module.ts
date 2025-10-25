import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "src/profile/profile.entity";
import { Tweet } from "src/tweet/tweet.entity";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { AuthModule } from "src/auth/auth.module";


@Module({
    controllers:[UsersController],
    providers:[UsersService],//This is where you provide your injectable service in
    exports:[UsersService],//This is where you expose your service to other external modules
    imports:[PaginationModule, TypeOrmModule.forFeature([User, Profile, Tweet]), forwardRef(()=>AuthModule)]
})
export class UsersModule{}