export const UserFilter = ({onFilterChange}) => {
  /**
   * The filter component for a user in the dashboard.
   * Filters:
   *  - User Name
   */

  return (
    <div className='filter-content'>
      <label htmlFor="usernameFilter">User Name:</label>
      <input id='usernameFilter' className='filter-text-input' type="text" placeholder='User Name' onChange={(e) => onFilterChange({username: e.target.value})}/>
    </div>
  )
}