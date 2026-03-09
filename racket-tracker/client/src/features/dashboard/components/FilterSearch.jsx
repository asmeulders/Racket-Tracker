export function FilterSearch({ renderFilter, onFilterChange }) {
    return (
        <div className='filter-container'>
            <form>
                {renderFilter(onFilterChange)}
            </form>
        </div>
    )
}