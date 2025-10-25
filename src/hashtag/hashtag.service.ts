import { Injectable } from '@nestjs/common';
import { DeepPartial, In, Repository } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Injectable()
export class HashtagService {

    constructor(@InjectRepository(Hashtag) private readonly hashtagRepository: Repository<Hashtag>){}

    public async createHashtag(createHashtagDto:CreateHashtagDto){
        let newHashtag = this.hashtagRepository.create(createHashtagDto as DeepPartial<Hashtag>)
        return  await this.hashtagRepository.save(newHashtag)
    }

    public async findHashtag(hashtags:number []){
        return await this.hashtagRepository.find({
            where:{id: In(hashtags)}
        })
    }

    public deleteHashtag(id:number){
        return this.hashtagRepository.delete({id:id})
    }
}
