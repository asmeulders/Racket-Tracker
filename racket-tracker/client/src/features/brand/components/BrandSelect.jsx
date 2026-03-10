export const BrandSelect = ({ onBrandChange, value, brands }) => {
    const handleSelect = (event) => {
        const brandId = event.target.value;
        onBrandChange(brandId);
    }
    
    return (
        <div>
            <label htmlFor='brand'>Brand:</label>
            <select name="brands" id="brand" value={value} required onChange={handleSelect}>
                <option value="">--Please choose a brand--</option>
                {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
            </select>
        </div>
    )
}

