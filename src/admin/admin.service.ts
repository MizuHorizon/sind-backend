import { Injectable, NotFoundException, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminUserDto } from './dto/create-admin.dto';
import { UpdateAdminUserDto } from './dto/update-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser } from 'src/twitter/entities/twitter.entity';
import { getCleanTextFromUrl } from 'src/service/site_service';
import { News } from 'src/news/entities/news.entity';
import GeminiService from 'src/service/gemini_service';
@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
    private jwtService: JwtService,
    private twitterApiService: TwitterApiService,
    @InjectRepository(TwitterUser)
    private twitterUserRepository: Repository<TwitterUser>,

    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private geminiService: GeminiService,
  ) { }

  async searchUser(username: string) {
    try {
      console.log("username", username);
      const user = await this.twitterApiService.getUserByUsername(username);
      console.log("user", user);
      return user;
    } catch (error) {
      console.log("error", error);
      throw new InternalServerErrorException('Failed to search user: ' + error.message);
    }
  }

  async addArticle(url: string) {
    try {
      const cleanText = await getCleanTextFromUrl(url);

      const prompt = `
      Summarize the following text:
      ${cleanText}
      -give me summary of text
      -json format
      example:
      {
        "title": "title of text",
        "summary": "summary of text"
      }
      `;


      const summary = await this.geminiService.generateContent(prompt);

      console.log("summary", summary.candidates[0].content);
      // const article = this.newsRepository.create({
      //   title: cleanText.title,
      //   content: cleanText.content,
      //   url: url,
      //   summary: summary.candidates[0].content.toString(),
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });


      const text = summary.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '');
      console.log("text", text);
      const json = JSON.parse(text);
      console.log("json", json);

      const article = this.newsRepository.create({
        title: json.title,
        summary: json.summary,
        url: url,
        createdAt: new Date(),
      });

      await this.newsRepository.save(article);


      return article;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add article: ' + error.message);
    }
  }

  async addUserOfTwitterToDb(username: string) {
    try {
      console.log("username", username);
      const user = await this.twitterApiService.getUserByUsername(username)
      console.log(user);
      const twitterUser = this.twitterUserRepository.create({
        username: user.username,
        displayName: user.name,
        profileImageUrl: user.profile_image_url,
        bio: user.description,
        twitterId: user.id
      });

      await this.twitterUserRepository.save(twitterUser);

      return twitterUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add user of Twitter to database: ' + error.message);
    }
  }


  async create(createAdminUserDto: CreateAdminUserDto): Promise<AdminUser> {
    try {
      // Check if user with email already exists
      const existingUser = await this.adminUserRepository.findOne({
        where: { email: createAdminUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const adminUser = this.adminUserRepository.create(createAdminUserDto);
      return await this.adminUserRepository.save(adminUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create admin user: ' + error.message);
    }
  }

  async findAll(): Promise<AdminUser[]> {
    try {
      return await this.adminUserRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admin users: ' + error.message);
    }
  }

  async findOne(id: number): Promise<AdminUser> {
    try {
      const adminUser = await this.adminUserRepository.findOne({ where: { id: String(id) } });
      if (!adminUser) {
        throw new NotFoundException(`Admin user with ID "${id}" not found`);
      }
      return adminUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch admin user: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<AdminUser> {
    try {
      const adminUser = await this.adminUserRepository.findOne({ where: { email } });
      if (!adminUser) {
        throw new NotFoundException(`Admin user with email "${email}" not found`);
      }
      return adminUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch admin user by email: ' + error.message);
    }
  }

  async update(id: number, updateAdminUserDto: UpdateAdminUserDto): Promise<AdminUser> {
    try {
      const adminUser = await this.findOne(id);

      this.adminUserRepository.merge(adminUser, updateAdminUserDto);

      return await this.adminUserRepository.save(adminUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update admin user: ' + error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.adminUserRepository.delete(String(id));
      if (result.affected === 0) {
        throw new NotFoundException(`Admin user with ID "${id}" not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete admin user: ' + error.message);
    }
  }

  async login(adminLoginDto: AdminLoginDto): Promise<{ access_token: string; user: Partial<AdminUser> }> {
    try {
      const adminUser = await this.findByEmail(adminLoginDto.email);

      if (!adminUser.isActive) {
        throw new UnauthorizedException('User account is inactive');
      }

      const isPasswordValid = await adminUser.comparePassword(adminLoginDto.password);


      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      adminUser.lastLoginAt = new Date();
      await this.adminUserRepository.save(adminUser);

      const payload = {
        sub: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        isSuperAdmin: adminUser.isSuperAdmin
      };

      // Return user data (excluding password)
      const { password, ...userWithoutPassword } = adminUser;

      return {
        access_token: this.jwtService.sign(payload),
        user: userWithoutPassword
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException('Login failed: ' + error.message);
    }
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<AdminUser> {
    try {
      const adminUser = await this.findOne(Number(id));

      const isPasswordValid = await adminUser.comparePassword(currentPassword);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      adminUser.password = await bcrypt.hash(newPassword, 10);

      return await this.adminUserRepository.save(adminUser);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password: ' + error.message);
    }
  }
}