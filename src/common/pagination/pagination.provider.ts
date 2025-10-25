import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import express from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from './paginator.interface';

@Injectable()
export class PaginationProvider {
    constructor(@Inject(REQUEST) private readonly request:express.Request){
        
    }
    public async paginateQuery<T extends ObjectLiteral>(paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>,
        relations?:string[]
    ):Promise<Paginated<T>> {
        const findOptions: FindManyOptions<T> = {
            skip: ((paginationQueryDto.page ?? 1) - 1) * (paginationQueryDto.limit ?? 10),
            take: paginationQueryDto.limit ?? 10
        }

        if (where) {
            findOptions.where = where
        }

        if(relations){
            findOptions.relations = relations
        }

        const result = await repository.find(findOptions)
        const totalItems = await repository.count()
        const totalPages = Math.ceil(totalItems / (paginationQueryDto.limit ?? 10))

        const currentPage = paginationQueryDto.page
        const nextPage = currentPage === totalPages ? currentPage : currentPage ?? 1 + 1
        const prevPage = currentPage === 1 ? currentPage : (currentPage ?? 1) - 1
        const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/';
        const newUrl = new URL(this.request.url, baseUrl)

        console.log(newUrl,'::::::BASE')
        const {limit = 10, page = 1} = paginationQueryDto

        const response: Paginated<T> = {
            data: result,
            meta: {
                itemsPerPage: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: totalPages
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
                last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
                current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${currentPage}`,
                next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
                previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${prevPage}`
            }
        }
        return response
    }
}
