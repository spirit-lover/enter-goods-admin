import { Inject, Injectable } from '@nestjs/common';
import { DATA_STORE, type DataStore } from '../data/contracts/data-store';

@Injectable()
export class AuditService {
  constructor(@Inject(DATA_STORE) private readonly store: DataStore) {}

  async record(input: {
    action: string;
    module: string;
    operatorId: string;
    operatorName: string;
    detail: string;
    ip?: string;
  }): Promise<void> {
    await this.store.createOperationLog({
      action: input.action,
      module: input.module,
      operatorId: input.operatorId,
      operatorName: input.operatorName,
      detail: input.detail,
      ip: input.ip ?? '127.0.0.1'
    });
  }
}
