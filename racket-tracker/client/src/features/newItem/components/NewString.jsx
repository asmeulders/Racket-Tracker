import { useState, useEffect } from "react";

import { StringForm } from "../../string";
import { useViewItem } from "../../viewItem/useViewItem";
import { StorePageLayout } from "../../store";

export const NewString = ({ onNewItem }) => {
    const { getList } = useViewItem();
    const [ data, setData ] = useState(null);

    useEffect(() => {
        getList('brands')
            .then(items => setData(prev => ({...prev, brands: items})));
    }, []);

    if (data === null) return <p>Loading...</p>

    //  TODO: Make modals for the other fields in case i want new options
    return (
        <StorePageLayout
            back={true}
            title={"Create a new String"}
        ><StringForm onSubmit={onNewItem} brands={data.brands} /></StorePageLayout>
    )
}