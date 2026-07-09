import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useString } from '../../string/useString';
import { BrandSelect } from '../../brand';
import { useViewItem } from '../useViewItem';
import { SplitButton } from '../../../components/splitButton/SplitButton';
import { EditString } from '../../editItem/components/EditString';

export function StringView({data, setData}) {
    const navigate = useNavigate();
    const { getString, deleteString, updateString } = useString();
    const { getList } = useViewItem();

    const [ string, setString ] = useState({});
    const [ updatedString, setUpdatedString ] = useState({});
    const [ show, setShow ] = useState(false);
    const [editData, setEditData] = useState({
        brands: []
    }); 

    useEffect(() => {
        setString(data);
    }, [data]);

    if (Object.keys(string).length === 0) return <div>String not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this string?");
        if (confirmed) {
            await deleteString(string.id);
            navigate('/store/view-list/strings');
        }
    }

    const handleEdit = async () => {
        const list = await getList('brands');
        setEditData(prev => ({ ...prev, brands: list }));
        setUpdatedString({...string})
        handleShow();
    }

    const handleSave = async () => {
        const res = await updateString({
            stringId: string.id,
            brandId: updatedString.brandId,
            name: updatedString.name,
            pricePerRacket: updatedString.pricePerRacket
        });

        setData(res.data.string);
        setUpdatedString({});
        setIsEditing(false);
    }

    const handleNewBrand = async () => {
        const list = await getList('brands');
        setEditData({ brands: list });
    }

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const dropdownActions = [
        {
            label: 'Delete String',
            onClick: handleDelete
        },
        {
            label: 'New String',
            onClick: () => navigate('/store/new-item/strings')
        }
    ];

    return (
        <>
            <div className='item-page'>
                <div className='view-item-header'>
                    <button type="button" className="back-btn" onClick={() => navigate('/store/view-list/strings')}>&larr;</button>
                    <h1>{string.brandName} {string.name}</h1>
                    <SplitButton label='Edit' onClick={handleEdit} dropdownActions={dropdownActions}/>
                </div>

                <div className='view-item-section'>
                    Price per Racket: ${string.pricePerRacket}
                </div>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                centered    
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Edit String Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditString onEditItem={setString} item={string}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};