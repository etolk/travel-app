async function handleSubmit(event) {
    event.preventDefault();

    // clear error message if exist
    document.getElementsByClassName("error")[0].innerHTML = "";

    let location = document.getElementById("location").value;
    let dateControl = document.querySelector('input[type="date"]');

    // trip countdown
    const today = new Date().getTime();
    const diff = dateControl.valueAsNumber - today;
    const daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);

    // form data validation
    if (daysDifference < 0) {
        document.getElementsByClassName("error")[0].innerHTML = "Please enter valid date";
        return;
    } else if (location.length == 0 && isNaN(dateControl.valueAsNumber)) {
        document.getElementsByClassName("error")[0].innerHTML = "Please enter city and date";
    } else if (isNaN(dateControl.valueAsNumber)) {
        document.getElementsByClassName("error")[0].innerHTML = "Please enter date";
    } else if (location.length == 0) {
        document.getElementsByClassName("error")[0].innerHTML = "Please enter city";
    }

    // prepare data for weatherbit API request
    let sDate = dateControl.valueAsNumber + -365 * 24 * 3600 * 1000;
    let eDate = dateControl.valueAsNumber + -364 * 24 * 3600 * 1000;
    let startDate = new Date(sDate).toISOString().slice(0, 10);
    let endDate = new Date(eDate).toISOString().slice(0, 10);
    let startDateValid =
        startDate.slice(0, 4).replace(/(2000|2[0-9]{3})$/g, 2020) + startDate.slice(4);
    let endDateValid = endDate.slice(0, 4).replace(/(2000|2[0-9]{3})$/g, 2020) + endDate.slice(4);

    const response = await fetch(`/getData/${location}/${startDateValid}/${endDateValid}`);
    const json = await response.json();
    console.log(json);

    if (typeof json.error == "undefined") {
        // validate form submission

        const holder = document.querySelector(".content-holder");

        // create figure object for image
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.setAttribute("src", json.img);
        img.setAttribute("width", "400px");
        figure.appendChild(img);

        // replace or append the image if already exist or not
        if (document.getElementsByClassName("img")[0].childElementCount > 0) {
            document
                .getElementsByClassName("img")[0]
                .replaceChild(figure, document.getElementsByTagName("figure")[0]);
        } else {
            document.getElementsByClassName("img")[0].appendChild(figure);
        }

        // create forecast object
        document.getElementsByClassName(
            "forecast"
        )[0].innerHTML = `<p>Typical weather for then is: ${json.temp_avg}°C. High: ${json.temp_max}°C, Low: ${json.temp_min}°C</p>`;

        // create trip counter days object
        document.getElementsByClassName(
            "info"
        )[0].innerHTML = `<p>Trip to ${json.city}, ${json.country} is ${daysDifference} days away</p>`;
        holder.removeAttribute("hidden");
    } else {
        // if object responce has an error show it
        document.getElementsByClassName("error")[0].innerHTML = "Please enter valid city";
    }
}

export { handleSubmit };
