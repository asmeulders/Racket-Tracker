import { BrandForm } from "../../brand";

export const NewBrand = ({ onNewItem }) => {
    return (
        <>
            <h1>Create a new Brand</h1>
            <BrandForm onDataCreated={onNewItem} />
        </>
    )
}