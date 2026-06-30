import { UserForm } from "../../user";

export const NewUser = ({ onNewItem }) => {
    return (
        <>
            <h1>Create a new User</h1>
            <UserForm onDataCreated={onNewItem} />
        </>
    )
}