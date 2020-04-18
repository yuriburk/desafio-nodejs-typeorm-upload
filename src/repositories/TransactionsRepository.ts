import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
    balance.income = await this.getValues('income');
    balance.outcome = await this.getValues('outcome');
    balance.total = balance.income - balance.outcome;

    return balance;
  }

  private async getValues(type: 'income' | 'outcome'): Promise<number> {
    const initialValue = 0;
    const transactions = await this.find({ where: { type } });

    return transactions?.length > 0
      ? transactions.reduce((accumulator, currentTransaction) => {
          const result = accumulator + currentTransaction.value;
          return result;
        }, initialValue)
      : initialValue;
  }
}

export default TransactionsRepository;
