import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function formatDate(date: string): string {
  const formatedDate = format(new Date(date), 'd MMM yyyy', {
    locale: ptBR,
  });
  return formatedDate;
}

export { formatDate };
