import { StorePageLayout } from "../../store";
import { UserForm } from "../../user";

export const NewUser = ({ onNewItem }) => {
    return (
        <StorePageLayout
            back={true}
            title={"Create a new User"}
        >
            <UserForm onSubmit={onNewItem} />
        </StorePageLayout>
    )
}