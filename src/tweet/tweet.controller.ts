import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { TweetService } from "./tweet.service";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { UpdateTweetDto } from "./dto/update-tweet.dto";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { ActiveUser } from "src/auth/decorators/active-users.decorator";

@Controller('tweet')
export class TweetController{
    constructor(private tweetService:TweetService){}

@Get(':id')
public GetAllTweets(@Param('id', ParseIntPipe) param:number,
@Query() paginationQueryDto:PaginationQueryDto){
    return this.tweetService.getTweets(param,paginationQueryDto)
}

    @Post()
    public CreateTweet(@Body() tweet:CreateTweetDto, @ActiveUser('email') user){
        console.log(user)
        //return this.tweetService.createTweet(tweet)
    }


    @Patch()
    public UpdateTweet(@Body() tweet:UpdateTweetDto){
        return this.tweetService.updateTweet(tweet)
    }

    @Delete(':id')
    public DeleteTweet(@Param('id', ParseIntPipe) id:number){
        return this.tweetService.deleteTweet(id)
    }
}