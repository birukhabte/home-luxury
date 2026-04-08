import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    return this.usersService.findById(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      email: string;
      passwordHash: string;
      name: string;
      role?: UserRole;
    },
  ): Promise<any> {
    return this.usersService.create(body);
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ): Promise<any> {
    return this.usersService.validateLogin(body.email, body.password);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      email: string;
      passwordHash: string;
      name: string;
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<any> {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
