const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;
let API_KEY = '18aab09103d29c7de870902d5922828f';
let city;


inputField.addEventListener("keyup", e =>{
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){

        city = inputField.value;

        api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`; 

        fetchData(api);
    }
});

locationBtn.addEventListener("click", () =>{
    navigator.geolocation.getCurrentPosition((success) => {
        // console.log(success);
        let latitude = success.coords.latitude;
        let longitude = success.coords.longitude;

        api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    
        fetchData(api);
    });
});

function fetchData(api){
    infoTxt.innerText = "Getting weather details...";
        infoTxt.classList.add("pending");
        // getting api response and returning it with parsing into js obj and in another 
        // then function calling weatherDetails function with passing api result as an argument
        fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
            
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info){
    if(info.cod == "404"){ // if user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        console.log(info);
        //getting required properties value from the whole weather information
        const city = info.name;
        const country = info.sys.country;
        const {description, id, main} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        let capitalize_first = description.charAt(0).toUpperCase() + description.slice(1)

        // using custom weather icon according to the id which api gives to us
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        //passing a particular weather info to a particular element
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = `${capitalize_first}`;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
