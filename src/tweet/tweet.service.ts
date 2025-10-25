import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DeepPartial, Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/paginator.interface';

@Injectable()
export class TweetService {
    constructor(private readonly userService: UsersService,
        @InjectRepository(Tweet) private readonly tweetRepository: Repository<Tweet>,
        private readonly hashtagService: HashtagService,
        private readonly paginationProvider:PaginationProvider
    ) { }


    public async getTweets(userId: number, paginationQueryDto: PaginationQueryDto): Promise<Paginated<Tweet>> {
        let user = await this.userService.FindUserById(userId)
        if (!user) {
            throw new NotFoundException(`User with userId ${userId} is not found`)
        }

        return await this.paginationProvider.paginateQuery(paginationQueryDto, 
            this.tweetRepository,
            {user:{id:userId}}
        )

        // const limit = paginationQueryDto.limit ?? 10;
        // const page = paginationQueryDto.page ?? 1;
        // return await this.tweetRepository.find({
        //     where: {
        //         user: { id: userId }
        //     },
        //     skip: page ?? (1) * limit,
        //     take: limit
        // })
    }

    public async createTweet(createTweetDto: CreateTweetDto) {
        let user = await this.userService.FindUserById(createTweetDto.userId)
        console.log(createTweetDto, ':::::::')
        let hashtags = await this.hashtagService.findHashtag(createTweetDto?.hashtags ?? [])


        let newTweet = this.tweetRepository.create({ ...createTweetDto, user, hashtags } as DeepPartial<Tweet>)
        return await this.tweetRepository.save(newTweet)
    }


    public async updateTweet(updateTweetDto: UpdateTweetDto) {
        // find hashtags from hashtags related table the way hashtag update works is it wil find hashtags if 
        //user provided hnew hashtags but if none it will remain enpty array
        //if an empty hashtag array is provided it will delete the related hashtags from the junction table
        //meaning after update that tweet will no longer have any hashtags

        let hashtags = await this.hashtagService.findHashtag(updateTweetDto.hashtags ?? [])

        //find tweet by Id

        let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id })

        //chech for request body values to know if to update properties or not

        if (tweet) {
            tweet.text = updateTweetDto.text ?? tweet.text;
            tweet.image = updateTweetDto.image ?? tweet.image
            tweet.hashtags = hashtags
            return await this.tweetRepository.save(tweet);
        }

    }


    public async deleteTweet(id: number) {
        return await this.tweetRepository.delete(id)
    }

}
