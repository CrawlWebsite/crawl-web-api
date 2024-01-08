import { IBaseController } from './interfaces/base.controller.interface';

export class BaseController implements IBaseController {
  constructor() {
    return;
  }

  protected authorizeUserByToken(request: any, userId: number): boolean {
    return request?.user?.id == userId;
  }
}
