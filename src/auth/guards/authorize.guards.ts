import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import authConfig from "../config/auth.config";
import { Reflector } from "@nestjs/core";
import { REQUEST_USER_CONSTANT } from "src/constants/constants";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,
        private readonly reflector:Reflector
    ) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        //READ IS PUBLIC META DATA
        const isPublic = this.reflector.getAllAndOverride('isPublic',[context.getHandler(),
            context.getClass()
        ])

        if(isPublic){
            return true
        }

        //EXTRACT REQUEST FROM EXECUTION CONTEXT
        const request: Request = context.switchToHttp().getRequest()
        //EXTRACT TOKEN FROM THE REQUEST HEADER
        const token = request.headers.authorization?.split(' ')[1]
        //VALIDATE TOKEN AND PROVIDE/DENY ACCESS
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.authConfiguration)
            request[REQUEST_USER_CONSTANT] = payload

        } catch (error) {
            throw new UnauthorizedException()
        }
        return true
    }

}