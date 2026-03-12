import './FilterSearch.css';

export function FilterSearch({ renderFilter, onFilterChange }) {
    return (
        <form>
            {renderFilter(onFilterChange)}
        </form>
    )
}