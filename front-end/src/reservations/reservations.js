import React, { useState } from "react";

function Reservations() {
    const [name, setName] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <main>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="first_name">
                        First Name:
                        <input id="first_name" type="text" name="first_name"/>
                    </label>
                    <label htmlFor="last_name">
                        Last Name:
                        <input id="last_name" type="text" name="last_name"/>
                    </label>
                    <label htmlFor="mobile_number">
                        Mobile Number:
                        <input id="mobile_number" type="number" name="mobile_number"/>
                    </label>
                    <label htmlFor="reservation_date">
                        Reservation Date:
                        <input id="reservation_date" type="date" name="reservation_date"/>
                    </label>
                    <label htmlFor="reservation_time">
                        Reservation Time:
                        <input id="reservation_time" type="datetime-local" name="reservation_time"/>
                    </label>
                    <label>
                        Party Size:
                        <input id="people" type="number" name="people"/>
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button">Cancel</button>
                </form>
            </div>

        </main>
    )
};

export default Reservations;
