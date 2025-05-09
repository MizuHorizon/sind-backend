import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwitterUser } from './entities/twitter.entity';
import { CreateTwitterUserDto } from './dto/create-twitter-user.dto';
import { UpdateTwitterUserDto } from './dto/update-twitter-user.dto';

@Injectable()
export class TwitterUserService {
  constructor(
    @InjectRepository(TwitterUser)
    private twitterUserRepository: Repository<TwitterUser>,
  ) {}

  async create(createTwitterUserDto: CreateTwitterUserDto): Promise<TwitterUser> {
    const twitterUser = this.twitterUserRepository.create(createTwitterUserDto);
    return await this.twitterUserRepository.save(twitterUser);
  }

  async findAll(): Promise<TwitterUser[]> {
    return await this.twitterUserRepository.find();
  }

  async findOne(id: string): Promise<TwitterUser> {
    const twitterUser = await this.twitterUserRepository.findOne({ where: { id } });
    if (!twitterUser) {
      throw new NotFoundException(`Twitter user with ID "${id}" not found`);
    }
    return twitterUser;
  }

  async findByUsername(username: string): Promise<TwitterUser> {
    const twitterUser = await this.twitterUserRepository.findOne({ where: { username } });
    if (!twitterUser) {
      throw new NotFoundException(`Twitter user with username "${username}" not found`);
    }
    return twitterUser;
  }

  async update(id: string, updateTwitterUserDto: UpdateTwitterUserDto): Promise<TwitterUser> {
    const twitterUser = await this.findOne(id);
    
    // Update the user with new data
    this.twitterUserRepository.merge(twitterUser, updateTwitterUserDto);
    
    return await this.twitterUserRepository.save(twitterUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.twitterUserRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Twitter user with ID "${id}" not found`);
    }
  }

  async getActiveUsers(): Promise<TwitterUser[]> {
    return await this.twitterUserRepository.find({ where: { isActive: true } });
  }
}