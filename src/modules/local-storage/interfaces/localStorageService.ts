export const LocalStorageServiceKey = Symbol();

export const CLS_KEYS = {
  USER_ID: 'userId',
};

export default interface LocalStorageService {
  setId(contextId: string): void;
  getId(): string;
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
}
