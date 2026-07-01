import { useState, useEffect } from "react";

import { OrderForm } from "../../order";
import { useViewItem } from "../../viewItem/useViewItem";

export const EditOrder = ({ onEditItem, item }) => {
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

    //  TODO: Make modals for the other fields in case i want Edit options
    return (
        <>
            <h1>Edit order {data.id}</h1>
            <OrderForm onDataCreated={onEditItem} order={item} rackets={data.rackets} strings={data.strings} users={data.users} />
            <div>
                <h3>Original Order</h3>
                <div>Customer: {item.user.firstName} {item.user.lastName}</div>
                <div>Racket: {item.racketBrand} {item.racketName}</div>
                <div>Mains: {item.jobDetails[0].stringBrand} {item.jobDetails[0].stringName} @ {item.jobDetails[0].tension}lbs</div>
                {!item.sameForCrosses && <div>Crosses: {item.jobDetails[1].stringBrand} {item.jobDetails[1].stringName} @ {item.jobDetails[1].tension}lbs</div>}
                <div>Due: {item.due}</div>
            </div>
        </>
    )
}