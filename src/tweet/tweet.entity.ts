import { Hashtag } from "src/hashtag/hashtag.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Tweet{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:'text',
        nullable:false
    })
    text:string

     @Column({
        type:'text',
        nullable:true
    })
    image?:string

     @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date


    @ManyToOne(()=>User, (user)=>user.tweets, {eager:true})//A foreign key column will automatically be created here no need for join column
    user:User

    @ManyToMany(()=>Hashtag, (hashtag)=>hashtag.tweet, {eager:true})
    @JoinTable()
    hashtags:Hashtag[]
}