interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}
