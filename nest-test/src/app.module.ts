import { Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    BlogModule,
    TypeOrmModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
