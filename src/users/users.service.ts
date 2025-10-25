import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from "@nestjs/common"
import { DeepPartial, Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Profile } from "src/profile/profile.entity";
import { ConfigService } from "@nestjs/config";
import { PaginationProvider } from "src/common/pagination/pagination.provider";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { Paginated } from "src/common/pagination/paginator.interface";
import { HashingProvider } from "src/auth/provider/hashing.provider";

@Injectable()//INjectable simply means the service can be injected into another class
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private readonly configService: ConfigService,
        private readonly paginationProvider: PaginationProvider,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) { }



    public async getAllUsers(paginationQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
        try {
            return await this.paginationProvider.paginateQuery(
                paginationQueryDto,
                this.userRepository,
                undefined,
                ['profile']
            )

        } catch (error) {
            throw new RequestTimeoutException(`An error has occured, please try again later`,
                { description: 'Could not connect to database' })
        }

    }


    public async createUser(userDto: CreateUserDto) {
        try {
            //Create profile, besides the profile entities are all optional, that's why we are  expecting it to be empty so we cann assign null to it
            userDto.profile = userDto.profile ?? {}

            //This check here is to ensure that a profile must be created first  before the user is created

            // let newProfile = this.profileRepository.create(userDto.profile as DeepPartial<Profile>)

            // await this.profileRepository.save(newProfile)

            //create user
            //find existing user

            let existingUser = await this.userRepository.findOne({
                where: [{ userName: userDto.userName }, { email: userDto.email }]
            })

            if (existingUser) {
                throw new BadRequestException('There is an existing user with this email or username')
            }


            let newUser = this.userRepository.create({
                ...userDto as DeepPartial<User>,
                password: await this.hashingProvider.hashPassword(userDto.password)
            })
            await this.userRepository.save(newUser)
            return newUser
        } catch (error) {

            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException(`An error has occured, please try again later`,
                    { description: 'Could not connect to database' })
            }
            throw error
        }
    }


    public async deleteUser(id: number) {
        //find user by id

        //let user: any = await this.userRepository.findOneBy({id})

        ////delete user data

        await this.userRepository.delete(id)

        //delete profile
        //The id argument is not id for profile entity so we get it from user entity
        //await this.profileRepository.delete(user.profile.id)
        return { delete: true }
    }

    public async FindUserById(id: number) {
        let user: User | null = null

         try {
             user = await this.userRepository.findOneBy({ id })
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: 'The username provided could not be found'
            })
        }

        if (!user) {
            throw new UnauthorizedException("User does not exist!")
        }

        return user
       
    }


    public async findbyUsername(userName: string) {
        let user: User | null = null

        try {
            user = await this.userRepository.findOneBy({ userName })
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: 'The username provided could not be found'
            })
        }

        if (!user) {
            throw new UnauthorizedException("User does not exist!")
        }

        return user
    }
}