export const BrandButton = () => {
    const handleClick = () => {
        console.log("Click.");
    }

    return (
        <>
            <button type='button' className='new-brand-btn' onClick={handleClick}>New Brand +</button>
        </>
    );
}