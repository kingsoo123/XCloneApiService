import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { PaginationModule } from './common/pagination/pagination.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './auth/guards/authorize.guards';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './auth/config/auth.config';

const ENV = process.env.NODE_ENV

@Module({
  imports: [UsersModule, TweetModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: !ENV ? '.env' :`.env.${ENV.trim()}`
    }),
     TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:(config:ConfigService):TypeOrmModuleOptions=>({
    type: 'mysql', 
    //entities: [User], 
    autoLoadEntities:true,
    synchronize: false, 
    host: config.get('DB_HOST'),
    port: 3306,
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
  })
}), ProfileModule, HashtagModule, PaginationModule, ConfigModule.forFeature(authConfig), JwtModule.registerAsync(authConfig.asProvider())],
  controllers: [AppController],
  providers: [AppService, {
    provide:APP_GUARD,
    useClass:AuthorizeGuard
  }],
})
export class AppModule { }
