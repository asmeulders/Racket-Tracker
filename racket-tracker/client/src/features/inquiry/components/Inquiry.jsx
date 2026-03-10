import { format, parseISO } from 'date-fns';

import '../Inquiry.css';

export function Inquiry({inquiry}) {
  const displayDate = inquiry.date ? format(parseISO(inquiry.date), 'MM/dd/yyyy') : null;
  
  console.log(inquiry.date, displayDate)
  return (
      <div className='inquiry-container'>
        <div className='inquiry-header'>
          {displayDate ? `${displayDate}:` : ''} {inquiry.name}
        </div>
        <div className='contact-information'>
          <ul>
            <li>Phone number: {inquiry.phone}</li>
            <li>Email: {inquiry.email}</li>
          </ul>
        </div>
        <div className='message-container'>Message: {inquiry.message}</div>
      </div>
  )
}

