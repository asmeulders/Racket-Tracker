import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useBrand } from '../../brand/useBrand';
import { SplitButton } from '../../../components/splitButton/SplitButton';
import { StorePageLayout } from '../../store';

export function BrandView({data, setData}) {
    const navigate = useNavigate();
    const { getBrand, deleteBrand, updateBrand } = useBrand();

    const [ brand, setBrand ] = useState({});
    const [ updatedBrand, setUpdatedBrand ] = useState({});
    const [ show, setShow ] = useState(false);

    useEffect(() => {
        setBrand(data);
    }, [data]);

    if (Object.keys(brand).length === 0) return <div>Brand not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this brand?");
        if (confirmed) {
            await deleteBrand(brand.id);
            navigate('/store/view-list/brands');
        }
    }

    const handleEdit = async () => {
        setUpdatedBrand({...brand})
        handleShow();
    }

    const handleSave = async () => {
        const res = await updateBrand({
            brandId: brand.id,
            name: updatedBrand.name
        });
        setData(res.data.brand);
        setUpdatedBrand({});
        handleShow();
    }

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const dropdownActions = [
        {
            label: 'Delete Brand',
            onClick: handleDelete
        },
        {
            label: 'New Brand',
            onClick: () => navigate('/store/new-item/brands')
        }
    ];

    return (
        <StorePageLayout
            back={true}
            title={brand.name}
            actions={<button type="button" className="nav-btn" onClick={() => navigate(`/store/edit-item/brands/${brand.id}`)}>Edit Brand</button>}
            // back ?
        >
            {/* <Modal
                show={show}
                onHide={handleClose}
                centered    
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Edit Brand Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBrand onEditItem={setBrand} item={brand}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal> */}
        </StorePageLayout> 
    );
};