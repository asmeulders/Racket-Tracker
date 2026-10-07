import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useRacket } from '../../racket/useRacket';
import { BrandSelect } from '../../brand';
import { useDatabase } from '../../../utils/useDatabase';
import { useViewItem } from '../useViewItem';
import { EditRacket } from '../../editItem/components/EditRacket';
import { SplitButton } from '../../../components/splitButton/SplitButton';
import { StorePageLayout } from '../../store';

export function RacketView({data, setData}) {
    const navigate = useNavigate();
    const { getRacket, deleteRacket, updateRacket } = useRacket();
    const { getList } = useViewItem();

    const [ racket, setRacket ] = useState({});
    const [ updatedRacket, setUpdatedRacket ] = useState({});
    const [ show, setShow ] = useState(false);
    const [editData, setEditData] = useState({
        brands: []
    }); 

    useEffect(() => {
        console.log(data);
        setRacket(data);
    }, [data]);

    if (Object.keys(racket).length === 0) return <div>Racket not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this racket?");
        if (confirmed) {
            await deleteRacket(racket.id);
            navigate('/store/view-list/rackets');
        }
    }

    const handleEdit = async () => {
        const list = await getList('brands');
        setEditData(prev => ({ ...prev, brands: list }));
        setUpdatedRacket({...racket})
        handleShow();
    }

    const handleSave = async () => {
        const res = await updateRacket({
            racketId: racket.id,
            brandId: updatedRacket.brandId,
            name: updatedRacket.name,
            price: updatedRacket.price
        });

        setData(res.data.racket);
        setUpdatedRacket({});
        handleClose();
    }

    const handleNewBrand = async () => {
        const lsit = await getList('brands');
        setEditData({ brands: list });
    }

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const dropdownActions = [
        {
            label: 'Delete Racket',
            onClick: 'handleDelete'
        },
        {
            label: 'New Racket',
            onClick: () => navigate('/store/new-item/rackets')
        }
    ];

    return (
        <StorePageLayout
            title={`${racket.brandName} ${racket.name}`}
            // actions={} edit
        >
            <div className='view-item-section'>
                Price: ${racket.price}
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                centered    
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Edit Racket Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditRacket onEditItem={setRacket} item={racket}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </StorePageLayout>
    );
};