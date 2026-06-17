import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useInquiry } from './useInquiry';

export function InquiryPage() {
    const { getInquiryById, deleteInquiry } = useInquiry();
    const { inquiryId } = useParams();

    const [ inquiry, setInquiry ] = useState({});
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        getInquiryById(inquiryId)
            .then(data => setInquiry(data))
            .finally(() => setLoading(false));
    }, [inquiryId])

    if (loading) return <div>Loading...</div>;
    if (Object.keys(inquiry).length === 0) return <div>Inquiry not found.</div>;

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this inquiry?");
        if (confirmed) {
            deleteInquiry(inquiryId);
            navigate('/store-dashboard');
        }
    }

    // TODO: make css general for these?
    return (
        <div className='inquiry-page'>
            <div className='inquiry-card'>
                <div className='inquiry-details'>
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