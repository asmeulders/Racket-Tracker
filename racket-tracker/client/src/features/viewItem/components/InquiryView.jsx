import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useInquiry } from '../../inquiry/useInquiry';
import { StorePageLayout } from '../../store';

export function InquiryView({data, setData}) {
    const { getInquiry, deleteInquiry } = useInquiry();
    const { inquiryId } = useParams();

    const [ inquiry, setInquiry ] = useState({});

    useEffect(() => {
        setInquiry(data);
    }, [data]);

    if (Object.keys(inquiry).length === 0) return <div>Inquiry not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this inquiry?");
        if (confirmed) {
            await deleteInquiry(inquiry.id);
            navigate('/store/view-list/inquiries');
        }
    }

    return (
        <StorePageLayout
            back={true}
            title={`Inquiry #${inquiry.id} - ${inquiry.date}`}
        >
            <div className='view-item-section'>
                <ul>
                    <li>Name: {inquiry.name}</li>
                    <li>Email: {inquiry.email}</li>
                    <li>Phone: {inquiry.phone}</li>
                    <li>Message: <p>{inquiry.message}</p></li>
                </ul>
            </div>
        </StorePageLayout>
    );
};