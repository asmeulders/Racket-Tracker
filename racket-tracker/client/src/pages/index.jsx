import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Home = () => {
    const initDatabases = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/init_db');
            alert("Databases Created & Seeded!");
        } catch (error) {
            console.error("Error initializing DB:", error);
        }
    };
    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <button onClick={initDatabases} style={{ marginBottom: "20px" }}>
                Initialize & Seed Databases
            </button>
        </div>
    )
}

export default Home;