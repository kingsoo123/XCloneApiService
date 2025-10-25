import { Profile } from "src/profile/profile.entity";
import { Tweet } from "src/tweet/tweet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User{
@PrimaryGeneratedColumn()
id:number; 


@Column({
    type:'varchar',
    nullable:false,
    length:24,
    unique:true
})
userName:string;

@Column({
    type:'varchar',
    nullable:false,
    length:100,
    unique:true
})
email:string;


@Column({
    type:'varchar',
    nullable:false,
    length:100
})
password:string;

@OneToOne(()=>Profile, (profile)=>profile.user,{
    cascade:['insert']
})
profile:Profile


@OneToMany(()=>Tweet, (tweet)=>tweet.user)
tweets:Tweet[]//An array of tweets because one user can have multiple tweets


@CreateDateColumn()
createdAt:Date

@UpdateDateColumn()
updatedAt:Date

@DeleteDateColumn()
deleteAt:Date
}