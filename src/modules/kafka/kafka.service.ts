import {
  OnModuleDestroy,
  OnModuleInit,
  Injectable,
  Inject,
} from '@nestjs/common';
import { IConfig } from 'config';
import { ClientKafka } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

import { CONFIG } from '@crawl-web-api/module-config/config.provider';

import { KAFKA_TOPIC_PRODUCER } from './dto/types';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private client: ClientKafka;

  constructor(@Inject(CONFIG) private readonly configService: IConfig) {
    this.setUpKafaClient();
  }

  private setUpKafaClient() {
    const clientId = this.configService.get<string>('kafka.kafka_client_id');
    const brokers = this.configService
      .get<string>('kafka.kafka_brokers')
      .split(',');

    const consumerId = this.configService.get<string>('kafka.consumer_id');

    this.client = new ClientKafka({
      client: {
        clientId,
        brokers,
      },
      consumer: {
        groupId: consumerId,
      },
    });
  }

  getKafkaClient(): ClientKafka {
    return this.client;
  }

  async onModuleInit() {
    const requestPatterns = Object.values(KAFKA_TOPIC_PRODUCER);

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  public sendKafkaMessage(topic: KAFKA_TOPIC_PRODUCER, key: string, data: any) {
    this.client.send(topic, {
      key: key,
      value: data,
    });
  }

  public async sendAsyncKafkaMessage(
    topic: KAFKA_TOPIC_PRODUCER,
    key: string,
    data: any,
  ): Promise<Observable<any>> {
    const result = await lastValueFrom(
      this.client.send(topic, {
        key: key,
        value: data,
      }),
    );
    return result;
  }

  async sendKafkaMessageWithoutKey(topic: KAFKA_TOPIC_PRODUCER, data: any) {
    this.client.emit(topic, {
      value: data,
    });
  }

  async sendAsyncKafkaMessageWithoutKey(
    topic: KAFKA_TOPIC_PRODUCER,
    data: any,
  ): Promise<Observable<any>> {
    const result = await lastValueFrom(
      this.client.send(topic, {
        value: data,
      }),
    );
    return result;
  }

  async sendNotification(): Promise<any> {
    return this.client.emit('notify', { notify: true });
  }
}
