import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { IConfig } from 'config';

import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: IConfig) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [CONFIG],
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
