import '../css/app.css';
import emailjs from "emailjs-com";
import React, {useEffect, useState} from 'react';


export default function ContactUs() {
    const [status, setStatus] = useState(navigator.onLine ? "Online" : "Offline");
    useEffect(() => {
        // check the status every 5 seconds
        const interval = setInterval(() => {
            setStatus(navigator.onLine ? "Online" : "Offline");
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    function sendEmail(e) {
        e.preventDefault();
        // Convert the FormData object to a plain object
        let formData = {};
        for (let [key, value] of new FormData(e.target).entries()) {
            formData[key] = value;
        }
        // Store the form data in local storage
        localStorage.setItem("formData", JSON.stringify(formData));

        // Check if the browser is online
        if (navigator.onLine) {
            e.preventDefault();
            // Send the email
            emailjs
                .sendForm('service_g05skdv', 'template_2eb69rh', e.target, 'nrnsPeUE-_JxJJFNq')
                .then(
                    (result) => {
                        console.log(result.text);
                        // Clear the form data from local storage
                        localStorage.removeItem("formData");
                    },
                    (error) => {
                        console.log(error.text);
                    }
                );
            e.target.reset();
            console.log("email was sent. online!")
            document.getElementById("console").innerHTML = "Email will arrive shortly.";
        } else {
            console.log("Email saved to send later.");
            document.getElementById("console").innerHTML = "Email saved to send later. Connect to the internet  to send. The email will be sent shorly after the status change.";
        }
    }
    useEffect(() => {
        const handleOnline = () => {
            if (localStorage.getItem("formData")) {
                // Retrieve the form data from local storage
                let plainObjectformData = JSON.parse(localStorage.getItem("formData"));
                // Convert the plain object to FormData
                let formData = new FormData();
                for (let key in plainObjectformData) {
                    formData.append(key, plainObjectformData[key])
                }
                // Create a dummy <form> element
                let form = document.createElement("form");
                // Append the form data to the form
                for (let [key, value] of formData.entries()) {
                    let input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                }
                // Send the email
                emailjs.sendForm('service_g05skdv', 'template_2eb69rh', form, 'nrnsPeUE-_JxJJFNq')
                    .then((result) => {
                        console.log(result.text);
                        // Clear the form data from local storage
                        localStorage.removeItem("formData");
                    }, (error) => {
                        console.log(error.text);
                    });
            }
        }
        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, []);


    // Listen for changes in online/offline status
    window.addEventListener("online", () => setStatus("Online"));
    window.addEventListener("offline", () => setStatus("Offline"));

    return (
        <>
            <header>
                <h1 className="header-title">Sending emails with JavaScript</h1>
                <p>Type your email there and click send to recieve/give an email!</p>
            </header>
            <form onSubmit={sendEmail}>
                <label>Email from</label>
                <input type="email" name="emailfrom" placeholder="Your Email" required/>
                <label>Email to</label>
                <input type="email" name="email" placeholder="Recipient Email" required/>
                <label>Subject</label>
                <input type="text" name="subject" placeholder="Subject" required/>
                <label>Message</label>
                <textarea name="message" rows="5" placeholder="Write your message here" required/>
                <input type="submit" value="Send" className="submit"/>
            </form>
            <p className={`status ${status.toLowerCase()}`}>Status: {status}</p>
            <p id={"console"}></p>
        </>
    );
}