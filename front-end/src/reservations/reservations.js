import React, { useState } from "react";

function Reservations() {
    //const [name, setName] = useState([]);

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
                        <input id="mobile_number" type="tel" name="mobile_number"/>
                    </label>
                    <label htmlFor="reservation_date">
                        Reservation Date:
                        <input id="reservation_date" type="date" name="reservation_date" placeholder="YYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"/>
                    </label>
                    <label htmlFor="reservation_time">
                        Reservation Time:
                        <input id="reservation_time" type="time" name="reservation_time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}"/>
                    </label>
                    <label>
                        Party Size:
                        <input id="people" type="text" name="people"/>
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button">Cancel</button>
                </form>
            </div>

        </main>
    )
};

export default Reservations;
