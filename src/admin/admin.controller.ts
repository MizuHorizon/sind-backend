import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query } from '@nestjs/common';
import { AdminUserService } from './admin.service';
import { CreateAdminUserDto } from './dto/create-admin.dto';
import { UpdateAdminUserDto } from './dto/update-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { getCleanTextFromUrl } from 'src/service/site_service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminUserService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminUserDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    try {
      return await this.adminService.login(loginDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        error.status || HttpStatus.UNAUTHORIZED
      );
    }
  }


  @Post('users/twitter')
  async addUserOfTwitterToDb(@Query('username') username: string){
    try {
      return await this.adminService.addUserOfTwitterToDb(username);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add Twitter user to database',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  @Get('users/twitter')
  async searchUser(
    @Query('username') username: string) {
    try {
      return await this.adminService.searchUser(username);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message || 'Failed to add Twitter user to database',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('article')
  async scrapeNews(@Body() body: { url: string }) {
    try {
      return await this.adminService.addArticle(body.url);
    
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to scrape news',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminUserDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
