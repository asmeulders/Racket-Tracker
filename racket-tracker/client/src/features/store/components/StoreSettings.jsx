import { useEffect, useState } from "react";

import { useStore } from "../useStore";
import { set } from "date-fns";

export const StoreSettings = () => {
    const { getSettings, updateSettings } = useStore();

    const [ isEditing, setIsEditing ] = useState(false);
    const [ settings, setSettings ] = useState(null);

    useEffect(() => {
        getSettings()
            .then(data => {
                setSettings(data)
                console.log(data)
            });
    }, [])

    const handleClick = () => {
        // If editing we should now save
        if (isEditing) {
            updateSettings(settings);
        }
        setIsEditing(!isEditing)
    }

    return (
        // Need:
        //  - Default labor cost
        //  - default labor days
        <div className="store-settings-page">
            <h1>Settings</h1>
            <button onClick={handleClick}>{isEditing ? 'Save' : 'Edit'}</button>
            <div>
                {
                    settings === null ? 
                    <p>Loading</p> :
                    <div>
                        {
                            !isEditing ?
                            <ul>
                                <li>Labor Cost: {settings?.laborCost}</li>
                                <li>Labor Days: {settings?.laborDays}</li>
                            </ul> :
                            <div>
                                <label htmlFor="labor-cost">Labor Cost:</label>
                                <input type="number" step={0.01} min={0} value={settings.laborCost} onChange={(e) => setSettings(prev => ({...prev, laborCost: e.target.value}))} placeholder="Cost of Labor"/>

                                <label htmlFor="labor-days">Labor Days:</label>
                                <input type="number" min={0} value={settings.laborDays} onChange={(e) => setSettings(prev => ({...prev, laborDays: e.target.value}))} placeholder="Number of Days"/>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}