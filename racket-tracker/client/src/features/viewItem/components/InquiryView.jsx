import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useInquiry } from '../../inquiry/useInquiry';

export function InquiryView({data, setData}) {
    const { getInquiry, deleteInquiry } = useInquiry();
    const { inquiryId } = useParams();

    const [ inquiry, setInquiry ] = useState({});

    useEffect(() => {
        setInquiry(data);
    }, [data]);

    if (Object.keys(inquiry).length === 0) return <div>Inquiry not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this inquiry?");
        if (confirmed) {
            deleteInquiry(inquiry.id);
            navigate('/store-dashboard');
        }
    }

    return (
        <div className='item-page'>
            <div className='item-card'>
                <div className='item-fields'>
                    {/* Date */}
                    <span className='field-label'>Date:</span>
                    <span className='field-details'>{inquiry.date}</span>

                    {/* Name */}
                    <span className='field-label'>Name:</span>
                    <span className='field-details'>{inquiry.name}</span>

                    {/* Phone */}
                    <span className='field-label'>Phone:</span>
                    <span className='field-details'>{inquiry.phone}</span>

                    {/* Email */}
                    <span className='field-label'>Email:</span>
                    <span className='field-details'>{inquiry.email}</span>

                    {/* Message */}
                    <span className='field-label'>Name:</span>
                    <span className='field-details'>{inquiry.message}</span>

                </div>
            </div>
        </div>
    );
};