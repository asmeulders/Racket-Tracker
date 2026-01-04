import axios from 'axios';

export const fetchData = async ({onComplete, table, limit = null}) => {
    try {
        console.log(`Fetching data for ${table} - Limit of ${limit ? limit : "(none)"}`);
        const response = await axios.get(`http://127.0.0.1:5000/${table}/${limit ? limit : ""}`);
        onComplete(response.data);
    } catch (error) {
        console.error(`Error fetching ${table}:`, error);
    }
};

export const fetchOrders = async ({onComplete, limit = null}) => {
    fetchData({onComplete: onComplete, table: "orders", limit: limit});
}

export const fetchRackets = async ({onComplete, limit = null}) => {
    fetchData({onComplete: onComplete, table: "rackets", limit: limit});
}

export const fetchStrings = async ({onComplete, limit = null}) => {
    fetchData({onComplete: onComplete, table: "strings", limit: limit});
}

export const fetchBrands = async ({onComplete, limit = null}) => {
    fetchData({onComplete: onComplete, table: "brands", limit: limit});
}

export const fetchUsers = async ({onComplete, limit = null}) => {
    fetchData({onComplete: onComplete, table: "users", limit: limit});
}
