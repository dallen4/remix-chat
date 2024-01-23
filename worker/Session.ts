import { Env } from './index';

export class Session {
  private _active: boolean;

  constructor(controller: DurableObjectState, env: Env) {
    this._active = false;
  }

  get isActive() {
    return this._active;
  }

  async fetch(
    request: Request<unknown, CfProperties<unknown>>
  ): Promise<Response> {
    return new Response();
  }

  async createConnection() {}
}
