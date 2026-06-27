import { format, parseISO } from 'date-fns';

import '../Inquiry.css';

export function Inquiry({inquiry}) {
  const displayDate = inquiry.date ? format(parseISO(inquiry.date), 'MM/dd/yyyy') : null;
  
  return (
    <div className='inquiry-details'>
      <div className='item-info item-info--large'>
        {displayDate ? `${displayDate}:` : ''} {inquiry.name}
      </div>
      <div className='item-info'>
        <ul>
          <li>Phone number: {inquiry.phone}</li>
          <li>Email: {inquiry.email}</li>
          <li>Message: {inquiry.message}</li>
        </ul>
      </div>
    </div>
  )
}

