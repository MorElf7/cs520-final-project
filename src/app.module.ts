import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MONGO_SECRET } from 'config/index';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    UserModule,
    ApplicationModule,
    MongooseModule.forRoot(MONGO_SECRET),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
