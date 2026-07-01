import { UserForm } from "../../user";

export const EditUser = ({ onEditItem, item }) => {
    return (
        <>
            <h1>Edit User</h1>
            <UserForm onDataCreated={onEditItem} />
        </>
    )
}