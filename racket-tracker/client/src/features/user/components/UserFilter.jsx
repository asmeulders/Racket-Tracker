export const UserFilter = ({onFilterChange}) => {
  /**
   * The filter component for a user in the dashboard.
   * Filters:
   *  - User Name
   */

  return (
    <div className='filter-container'>
      <input type="text" placeholder='User Name' onChange={(e) => onFilterChange(e.target.value)}/>
    </div>
  )
}