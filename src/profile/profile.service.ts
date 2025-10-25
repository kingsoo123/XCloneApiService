import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(Profile) private readonly profileRepository:Repository<Profile>){}

    getAllProfiles(){
        return this.profileRepository.find({
            relations:{
                user:true
            }
        })
    }
}
