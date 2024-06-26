// user.controller.ts
// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { UserService } from './user.service';
// import { User } from '../schemas/user.schema';
// import { CreateUserDto } from './user.dto';

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create user' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The user has been successfully created.',
  // })
  // async create(@Body() createUserDto: CreateUserDto) {
  //   this.userService.create(createUserDto);
  // }

  // @Get()
  // @ApiOperation({ summary: 'List users' })
  // @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  // async findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  // Add the rest of the CRUD operations...
}
