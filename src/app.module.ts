import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfigProd from './config/orm.config.prod';
import ormconfig from './config/ormconfig';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApartmentModule } from './apartment/apartment.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [ormconfig] }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormconfig : ormConfigProd,
    }),
    UserModule,
    AuthModule,
    ApartmentModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
