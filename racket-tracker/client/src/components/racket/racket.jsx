// import { useState, useEffect } from 'react'

export function RacketList({rackets}) {
    return(
        <div>
          <h2>Rackets</h2>
          <ul>
            {rackets.map(r => (
              <Racket key={r.id} racket={r}/>
            ))}
          </ul>
        </div>
    )
}

export function Racket({racket}) {
    // const [racket, setRacket] = useState([])

    // const fetchData = async () => {
    //     try {
    //     const racketRes = await axios.get(`http://127.0.0.1:5000/get-racket-by-id/${racket.id}`);
    //     setRacket(racketRes.data);
    //     } catch (error) {
    //     console.error("Error connecting to server:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    return (
            <li>{racket.name} - ${racket.price}</li>
    )
}