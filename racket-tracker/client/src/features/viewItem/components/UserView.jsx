import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useUser } from '../../user/useUser';
import { BrandSelect } from '../../brand';
import { SplitButton } from '../../../components/splitButton/SplitButton';
import { StorePageLayout } from '../../store';

export function UserView({data, setData}) {
    const navigate = useNavigate();
    const { deleteUser, updateUser } = useUser();

    const [ user, setUser ] = useState({});
    const [ updatedUser, setUpdatedUser ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ show, setShow ] = useState(false);

    useEffect(() => {
        setUser(data);
    }, [data]);

    if (Object.keys(user).length === 0) return <div>User not found.</div>;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            await deleteUser(user.id);
            navigate('/store/view-list/users');
        }
    }

    const handleEdit = async () => {
        setUpdatedUser({
            ...user,
            phone: user.phone ?? '',
        });
        handleShow();
    }

    const handleSave = async () => {
        const phone = updatedUser.phone !== "" ? updatedUser.phone : "NONE";
        const res = await updateUser({
            userId: user.id,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: phone,
            email: updatedUser.email
        });

        setData(res.data.user);
        setUpdatedUser({});
        handleClose();
    }

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const dropdownActions = [
        {
            label: 'Delete User',
            onClick: handleDelete
        },
        {
            label: 'New User',
            onClick: () => navigate('/store/new-item/uesrs')
        }
    ];

    return (
        <StorePageLayout
            title={`${user.firstName} ${user.lastName}`}
            // actions={} edit
        >
            <div className='view-item-section'>
                <ul>
                    <li>Username: {user.username}</li>
                    <li>Phone: {user.phone}</li>
                    <li>Email: {user.email}</li>
                </ul>
            </div>
            {/* <Modal
                show={show}
                onHide={handleClose}
                centered    
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Edit User Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditUser onEditItem={setUser} item={user}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal> */}
        </StorePageLayout>
    );
};