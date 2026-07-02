import { useState, useEffect } from "react";

import { RacketForm } from "../../racket";
import { useViewItem } from "../../viewItem/useViewItem";

export const EditRacket = ({ onEditItem, item }) => {
    const { getList } = useViewItem();
    const [ data, setData ] = useState(null);

    useEffect(() => {
        getList('brands')
            .then(items => setData(prev => ({...prev, brands: items})));
    }, []);

    if (data === null) return <p>Loading...</p>

    //  TODO: Make modals for the other fields in case i want Edit options
    return (
        <>
            <h1>Edit racket</h1>
            <RacketForm onDataCreated={onEditItem} brands={data.brands} />
        </>
    )
}