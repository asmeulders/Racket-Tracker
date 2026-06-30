import { BrandForm } from "../../brand";

export const NewBrand = ({ onNewItem }) => {
    if (data === null) return <p>Loading...</p>;

    return (
        <>
            <h1>Create a new Brand</h1>
            <BrandForm onDataCreated={onNewItem} />
        </>
    )
}