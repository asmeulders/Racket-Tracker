import axios from 'axios';

export function useDatabase() {
    const initDatabase = async () => { // move to useDashbaord
        try {
            await axios.post('http://127.0.0.1:5000/api/init_db');
            console.log("Databases Created & Seeded!");
        } catch (error) {
            console.error("Error initializing DB:", error);
        }
    };

    const fetchData = async ({table}) => {
        try {
            console.log(`Fetching data for ${table}`);
            const response = await axios.get(`http://127.0.0.1:5000/api/${table}`);
            console.log("Fetched data:\n", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${table}:`, error);
        }
    };

    const searchTable = async ({table, page, perPage, filters}) => { // TODO: move to useDashboard
        try {
            console.log(`Searching for data from ${table} on page ${page}`);
            const response = await axios.post(`http://127.0.0.1:5000/api/search-table`,{
                'tableName': table,
                'page': page,
                'perPage': perPage,
                'filters': filters
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${table}:`, error);
        }
    };

    return { initDatabase, fetchData, searchTable };
}

