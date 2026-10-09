import { BrandForm } from "../../brand";
import { StorePageLayout } from "../../store";

export const NewBrand = ({ onNewItem }) => {
    return (
        <StorePageLayout
            back={true}
            title={"Create a new Brand"}
        >
            <BrandForm onSubmit={onNewItem} />
        </StorePageLayout>
    )
}