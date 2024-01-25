import { Injectable } from '@nestjs/common';
import { CLS_ID, ClsService } from 'nestjs-cls';
import LocalStorageService from './interfaces/localStorageService';

@Injectable()
export default class NestjsClsStorageService implements LocalStorageService {
  constructor(private readonly cls: ClsService) {}

  public setId(id: string) {
    this.cls.set(CLS_ID, id);
  }

  public getId(): string | undefined {
    return this.cls.getId();
  }

  public set<T>(key: string, value: T): void {
    this.cls.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.cls.get(key);
  }
}
