export interface TokenPayload {
  userId: number;
  email: string;
}

export const REQ_HEADER_KEY = {
  CORRELATION_ID: 'x-correlation-id',
  USER_ID: 'x-user-id',
};
