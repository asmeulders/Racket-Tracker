import { useState, useEffect } from 'react';

export const OrderFilter = ({onFilterChange}) => {
    /**
     * The filter component for an order in the dashboard.
     * Filters:
     *  - User Name
     *  - Order Date
     *  - Due Date
     *  - Completion
     *  - Paid Status
     *  - Racket Brand
     *  - Racket Name
     *  - String Brand
     *  - String Name
     */
    const [ filters, setFilters ] = useState({
        'name': '',
        'orderDateBefore': '',
        'orderDateAfter': '',
        'dueDateBefore': '',
        'dueDateAfter': '',
        'completed': 'uncompleted',
        'paid': '',
        'racketBrand': '',
        'racketName': '',
        'stringNrand': '',
        'stringName': ''
    })

    // Whenever these are changed by the user update the search
    useEffect(() => {
        onFilterChange({
        'name': filters.name,
        'orderDateBefore': filters.orderDateBefore,
        'orderDateAfter': filters.orderDateAfter,
        'dueDateBefore': filters.dueDateBefore,
        'dueDateAfter': filters.dueDateAfter,
        'completed': filters.completed,
        'paid': filters.paid,
        'racketBrand': filters.racketBrand,
        'racketName': filters.racketName,
        'stringNrand': filters.stringBrand,
        'stringName': filters.stringName
        })
    }, [filters])

    return (
        <div className='filter-content'>
            {/* User Name */}
            <label htmlFor="nameInput">Customer Username/First Name/Last Name:</label>
            <input id="nameInput" className="filter-text-input" type="text" placeholder='Name' onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))}/>
            
            {/* Order Date */}
            <label htmlFor="orderDateBefore">Ordered Before:</label>
            <input className="filter-date-input" type="date" id='orderDateBefore' value={filters.orderDateBefore} onChange={(e) => setFilters(prev => ({...prev, orderDateBefore: e.target.value}))}/>

            <label htmlFor="orderDateAfter">Ordered After:</label>
            <input className="filter-date-input" type="date" id='orderDateAfter' value={filters.orderDateAfter} onChange={(e) => setFilters(prev => ({...prev, orderDateAfter: e.target.value}))}/>
            
            {/* Order Due Date */}
            <label htmlFor="dueDateBefore">Order Due Before:</label>
            <input className="filter-date-input" type="date" id='dueDateBefore' value={filters.dueDateBefore} onChange={(e) => setFilters(prev => ({...prev, dueDateBefore: e.target.value}))}/>

            <label htmlFor="dueDateAfter">Order Due After:</label>
            <input className="filter-date-input" type="date" id='dueDateAfter' value={filters.dueDateAfter} onChange={(e) => setFilters(prev => ({...prev, dueDateAfter: e.target.value}))}/>
            
            {/* Racket */}
            <label htmlFor="racketFilter">Racket:</label>
            <div id="racketFilter" className='brand-item-container'>
                <input className="filter-text-input" type="text" placeholder='Racket Brand' onChange={(e) => setFilters(prev => ({...prev, racketBrand: e.target.value}))}/>
                <input className="filter-text-input" type="text" placeholder='Racket Name' onChange={(e) => setFilters(prev => ({...prev, racketName: e.target.value}))}/>
            </div>
            
            {/* String */}
            <label htmlFor="stringFilter">String:</label>
            <div id="stringFilter" className='brand-item-container'>
                <input className="filter-text-input" type="text" placeholder='String Brand' onChange={(e) => setFilters(prev => ({...prev, stringBrand: e.target.value}))}/>
                <input className="filter-text-input" type="text" placeholder='String Name' onChange={(e) => setFilters(prev => ({...prev, stringName: e.target.value}))}/>
            </div>
            
            {/* Paid */}
            <label htmlFor="isPaidFilter">Payment Status:</label>
            <select id="isCompleteFilter" onChange={(e) => setFilters(prev => ({...prev, paid: e.target.value}))} value={filters.paid}>
                <option value="">Show All</option>
                <option value="unpaid">Show Only Unpaid</option>
                <option value="paid">Show Only Paid</option>
            </select>
            
            {/* Completed */}
            <label htmlFor="isCompleteFilter">Order Progress:</label>
            <select id="isCompleteFilter" onChange={(e) => setFilters(prev => ({...prev, completed: e.target.value}))} value={filters.completed}>
                <option value="">Show All</option>
                <option value="uncompleted">Show Only Uncompleted</option>
                <option value="completed">Show Only Completed</option>
            </select>
        </div>
    )
}