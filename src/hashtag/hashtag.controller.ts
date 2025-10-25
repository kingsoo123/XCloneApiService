import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {

    constructor(private hashtagService:HashtagService){}
    @Post()
    public CreateNewHastag(@Body() createHashtagDto:CreateHashtagDto){
        return this.hashtagService.createHashtag(createHashtagDto)
    }

    @Delete(':id')
    public DeleteHashtag(@Param('id', ParseIntPipe) hashtag:number){
        return this.hashtagService.deleteHashtag(hashtag)
    }
}
