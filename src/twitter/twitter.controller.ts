import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateTwitterDto } from './dto/create-twitter.dto';
import { UpdateTwitterDto } from './dto/update-twitter.dto';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  // @Post()
  // create(@Body() createTwitterDto: CreateTwitterDto) {
  //   return this.twitterService.create(createTwitterDto);
  // }

  // @Get()
  // findAll() {
  //   return this.twitterService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.twitterService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTwitterDto: UpdateTwitterDto) {
  //   return this.twitterService.update(+id, updateTwitterDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.twitterService.remove(+id);
  // }
}
