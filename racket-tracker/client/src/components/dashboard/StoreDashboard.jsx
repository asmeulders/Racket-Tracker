import React from 'react';
import { useState, useEffect } from 'react';
import './StoreDashboard.css';

import { Racket } from '../racket/Racket.jsx'
import { Order, OrderForm } from '../order/Order.jsx'
import { String } from '../string/String.jsx'
import { User } from '../user/User.jsx'
import { Brand } from '../brand/Brand.jsx'
import { fetchOrders, fetchRackets, fetchStrings, fetchBrands, fetchUsers } from '../../common/db_utils.js';

export function StoreDashboard() {
    const [users, setUsers] = useState([]);
    const [rackets, setRackets] = useState([]);
    const [orders, setOrders] = useState([]);
    const [strings, setStrings] = useState([]);
    const [brands, setBrands] = useState([]);
    const [activeTab, setActiveTab] = useState('order');
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);

    const fetchAllData = async () => {
        try {
            fetchOrders({onComplete: setOrders});
            fetchRackets({onComplete: setRackets});
            fetchStrings({onComplete: setStrings});
            fetchBrands({onComplete: setBrands});
            fetchUsers({onComplete: setUsers});
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'order':
                return <TabContent 
                    data={orders} 
                    renderItem={(order) => (<Order order={order} />)}
                    onDataDeleted={() => fetchOrders({onComplete: setOrders})} 
                    currentPage={currentPage} 
                    limit={limit} 
                    activeTab={activeTab}
                />;
            case 'racket':
                return <TabContent 
                    data={rackets} 
                    renderItem={(racket) => (<Racket racket={racket} />)}
                    onDataDeleted={() => fetchRackets({onComplete: setRackets})} 
                    currentPage={currentPage} 
                    limit={limit} 
                    activeTab={activeTab}
                />;
            case 'string':
                return <TabContent 
                    data={strings} 
                    renderItem={(string) => (<String string={string} />)}
                    onDataDeleted={() => fetchStrings({onComplete: setStrings})} 
                    currentPage={currentPage} 
                    limit={limit} 
                    activeTab={activeTab}
                />;
            case 'user':
                return <TabContent 
                    data={users} 
                    renderItem={(user) => (<User user={user} />)}
                    onDataDeleted={() => fetchUsers({onComplete: setUsers})} 
                    currentPage={currentPage} 
                    limit={limit} 
                    activeTab={activeTab}
                />;
            case 'brand':
                return <TabContent 
                    data={brands} 
                    renderItem={(brand) => (<Brand brand={brand} />)}
                    onDataDeleted={() => fetchBrands({onComplete: setBrands})} 
                    currentPage={currentPage} 
                    limit={limit} 
                    activeTab={activeTab} 
                />;
            default:
                return <TabContent 
                    data={orders} 
                    renderItem={(order) => (<Order order={order} />)}
                    onDataDeleted={() => fetchOrders({onComplete: setOrders})} 
                    currentPage={currentPage} 
                    limit={limit} 
                    activeTab={activeTab}
                />;
        }
    }

    const getTabClass = (tabName) => {
        return `tab-button ${activeTab === tabName ? 'active' : ''}`;
    };

    const handleSelect = (event) => {
        const selectedLimit = event.target.value;
        setLimit(selectedLimit);
    };

    const goLeft = () => {
        if (currentPage <= 0) {
            return;
        } else {
            setCurrentPage(currentPage-1);
        }
    };

    const goRight = () => {
        if (currentPage >= maxPage) {
            return;
        } else {
            setCurrentPage(currentPage+1);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // ============================================================================
    // TODO fix this
    // ============================================================================
    useEffect(() => {
        setMaxPage(Math.ceil(orders.length / limit));
    }, [orders]);

    return (
        <div className='store-dashboard-page'>
            <div className='dashboard-container'>
                <div className='tab-header'>
                    <button 
                        className={getTabClass('order')} 
                        onClick={() => setActiveTab('order')}
                    >
                        Orders
                    </button>
                    <button 
                        className={getTabClass('racket')} 
                        onClick={() => setActiveTab('racket')}
                    >
                        Rackets
                    </button>
                    <button 
                        className={getTabClass('string')} 
                        onClick={() => setActiveTab('string')}
                    >
                        Strings
                    </button>
                    <button 
                        className={getTabClass('user')} 
                        onClick={() => setActiveTab('user')}
                    >
                        Users
                    </button>
                    <button 
                        className={getTabClass('brand')} 
                        onClick={() => setActiveTab('brand')}
                    >
                        Brands
                    </button>
                </div>
                <div id='content-box'>
                    {renderContent()}
                </div>
                <div id='query-info-container'>
                    <p id='query-info'>
                        Queried {activeTab} - showing
                        <select name="numResults" id="num-results" value={limit} onChange={handleSelect}>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select> 
                        per page.
                        <button onClick={goLeft}>Left</button>
                        {currentPage+1}
                        <button onClick={goRight}>Right</button>
                    </p>
                </div>
            </div>
            <OrderForm onOrderCreated={() => fetchOrders({onComplete: setOrders})} rackets={rackets} strings={strings} users={users} />
        </div>
    )
}


export const TabContent = ({ data, renderItem, onDataDeleted, currentPage, limit, activeTab}) => {
  const [tabData, setTabData] = useState([]);

  const deleteData = async (data) => {
    try {
      await axios.delete(`http://localhost:5000/delete-${activeTab}/${data.id}`)
      onDataDeleted()
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const renderList = (tabData) => {
    return tabData.map(d => (
      <div key={d.id} >
        {renderItem(d)}
        <button onClick={() => {deleteData(d)}}>X</button>
      </div>
    ))
  }

  useEffect(() => {
    setTabData(data.slice(currentPage * limit, Math.min(data.length, currentPage * limit + limit)));
  }, [data, currentPage]);

  return (
    <div>
      <ul>
        {renderList(tabData)}
      </ul>
    </div>
  );
};