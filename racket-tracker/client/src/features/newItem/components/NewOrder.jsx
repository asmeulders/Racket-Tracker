import { useState, useEffect } from "react";

import { OrderForm } from "../../order";
import { useViewItem } from "../../viewItem/useViewItem";

export const NewOrder = ({ onNewItem }) => {
    const { getList } = useViewItem();
    const [ data, setData ] = useState(null);

    const tables = ["rackets", "strings", "users"];
    useEffect(() => {
        for (let i = 0; i < tables.length; i++) {
            getList(tables[i])
                .then(items => setData(prev => ({...prev, [tables[i]]: items})));
        }
    }, []);

    if (data === null) return <p>Loading...</p>

    return (
        <>
            <h1>Create a new order</h1>
            <OrderForm onDataCreated={onNewItem} rackets={data.rackets} strings={data.strings} users={data.users} />
        </>
    )
}