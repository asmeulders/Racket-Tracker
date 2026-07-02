import { BrandForm } from "../../brand";

export const EditBrand = ({ onEditItem, item }) => {
    return (
        <>
            <h1>Edit Brand</h1>
            <BrandForm onDataCreated={onEditItem} />
        </>
    )
}