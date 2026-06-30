import { useState, useEffect } from "react";

import { RacketForm } from "../../racket";
import { useViewItem } from "../../viewItem/useViewItem";

export const NewRacket = ({ onNewItem }) => {
    const { getList } = useViewItem();
    const [ data, setData ] = useState(null);

    useEffect(() => {
        getList('brands')
            .then(items => setData(prev => ({...prev, brands: items})));
    }, []);

    if (data === null) return <p>Loading...</p>

    //  TODO: Make modals for the other fields in case i want new options
    return (
        <>
            <h1>Create a new racket</h1>
            <RacketForm onDataCreated={onNewItem} brands={data.brands} />
        </>
    )
}