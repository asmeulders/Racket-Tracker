import { format, parseISO } from 'date-fns';

import '../Inquiry.css';

export function Inquiry({ item }) {
  const displayDate = item.date ? format(parseISO(item.date), 'MM/dd/yyyy') : null;
  
  return (
    <div className='inquiry-card'>
        <h2>{displayDate ? `${displayDate}:` : ''} {item.name}</h2>
    </div>
  )
}

