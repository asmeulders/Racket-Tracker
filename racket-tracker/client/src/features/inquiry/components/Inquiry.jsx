import { format, parseISO } from 'date-fns';

import '../Inquiry.css';

export function Inquiry({inquiry}) {
  const displayDate = inquiry.date ? format(parseISO(inquiry.date), 'MM/dd/yyyy') : null;
  
  return (
    <div className='inquiry-card'>
        <h2>{displayDate ? `${displayDate}:` : ''} {inquiry.name}</h2>
    </div>
  )
}

