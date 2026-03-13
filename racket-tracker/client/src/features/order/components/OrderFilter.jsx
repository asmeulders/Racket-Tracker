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
    const [username, setUsername] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [completed, setCompleted] = useState('');
    const [paid, setPaid] = useState('');
    const [racketBrand, setRacketBrand] = useState('')
    const [racketName, setRacketName] = useState('');
    const [stringBrand, setStringBrand] = useState('')
    const [stringName, setStringName] = useState('');

    // Whenever these are changed by the user update the search
    useEffect(() => {
        onFilterChange({
        'username': username,
        'order_date': orderDate,
        'due_date': dueDate,
        'completed': completed,
        'paid': paid,
        'racket_brand': racketBrand,
        'racket_name': racketName,
        'string_brand': stringBrand,
        'string_name': stringName
        })
    }, [username, orderDate, dueDate, completed, paid, racketBrand, racketName, stringBrand, stringName])

    return (
        <div className='filter-container'>
            {/* User Name */}
            <label htmlFor="usernameInput">Customer Name:</label>
            <input id="usernameInput" className="filter-text-input" type="text" placeholder='User Name' onChange={(e) => setUsername(e.target.value)}/>
            {/* Order Date */}
            <label htmlFor="orderDate">Order Date:</label>
            <input className="filter-date-input" type="date" id='orderDate' onChange={(e) => setOrderDate(e.target.value)}/>
            {/* Order Due Date */}
            <label htmlFor="orderDate">Order Due:</label>
            <input className="filter-date-input" type="date" id='dueDate' onChange={(e) => setDueDate(e.target.value)}/>
            {/* Racket */}
            <label htmlFor="racketFilter">Racket:</label>
            <div id="racketFilter" className='brand-item-container'>
                <input className="filter-text-input" type="text" placeholder='Racket Brand' onChange={(e) => setRacketBrand(e.target.value)}/>
                <input className="filter-text-input" type="text" placeholder='Racket Name' onChange={(e) => setRacketName(e.target.value)}/>
            </div>
            {/* String */}
            <label htmlFor="stringFilter">String:</label>
            <div id="stringFilter" className='brand-item-container'>
                <input className="filter-text-input" type="text" placeholder='String Brand' onChange={(e) => setStringBrand(e.target.value)}/>
                <input className="filter-text-input" type="text" placeholder='String Name' onChange={(e) => setStringName(e.target.value)}/>
            </div>
            {/* Paid */}
            <label htmlFor="isPaidFilter">Payment Status:</label>
            <select id="isCompleteFilter" onChange={(e) => setPaid(e.target.value)} value={paid}>
                <option value="">Show All</option>
                <option value="unpaid">Show Only Unpaid</option>
                <option value="paid">Show Only Paid</option>
            </select>
            {/* Completed */}
            <label htmlFor="isCompleteFilter">Order Progress:</label>
            <select id="isCompleteFilter" onChange={(e) => setCompleted(e.target.value)} value={completed}>
                <option value="">Show All (Order Progress)</option>
                <option value="uncompleted">Show Only Uncompleted</option>
                <option value="completed">Show Only Completed</option>
            </select>
        </div>
    )
}