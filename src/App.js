import React, {useState, useRef, useEffect} from 'react';

const api = {
  key: "607d41956edaca155b675cb8eabffdc7",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const work = 1500;
  const shortRest = 300;
  const longRest = 900;

  const [timerOn, setTimerState] = useState(false);
  const [timerType, setTimerType] = useState("Work");

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);

  const [weather, setWeather] = useState('');

  var totalTime = useRef(work);
  var cycleCount = useRef(0);

  useEffect(function() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        fetch(`${api.base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&APPID=${api.key}`)
        .then(res => res.json())
        .then((result) => {
          setWeather(result.weather[0].main);
          console.log(result.weather[0].main);
        })
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
      })
    } else {
      console.log("Allow access to location!")
    }
  }, [timerType]);

  useEffect(() => {
    let interval = null;
    const start = new Date().getTime();

    if(timerOn) {
      interval = setInterval(() => {
        var cur = new Date().getTime();
        
        var timeRemaining = totalTime.current - Math.floor((cur - start)/1000);
        
        var sec = Math.floor((timeRemaining%60));
        var min = Math.floor(timeRemaining/60);
  
        if(timeRemaining <= 0){
          setTimerState(false);
          document.getElementById("alarm").play();
          
          if(timerType === "Work"){

            cycleCount.current++;

            if(cycleCount.current%4 === 0){
              setTimerType("Long Rest");
              totalTime.current = longRest;
            } else {
              setTimerType("Short Rest");
              totalTime.current = shortRest;
            } 

          } else {
            setTimerType("Work");
            totalTime.current = work;
          }

          sec = Math.floor(timeRemaining%60);
          min = Math.floor(timeRemaining/60);
        }

        setSeconds(sec); 
        setMinutes(min);
        
      },1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn, timerType]);

  function resetTimer() {
    setTimerState(false);
    setSeconds(0);
    setMinutes(25);
    setTimerType("Work");
    cycleCount.current = 0;
    totalTime.current = work;
  }

  function displayTimer() {

    var toReturn = '';

    if(minutes < 10){
      toReturn += '0';
    }

    toReturn += minutes;
    toReturn += ':';

    if(seconds < 10){
      toReturn += '0';
    }

    toReturn += seconds;

    return toReturn;
  }

  function determineBackground() {
    if(weather === "Rain" || weather === "Drizzle" || weather === "Thunderstorm") {
      return "app rainy"
    } else if(weather === "Clear") {
      return "app sunny"
    } else if(weather === "Snow") {
      return "app snowy"
    } else if(weather === "Clouds") {
      return "app cloudy"
    }

    return "app"
  }

  return (
    <div className={determineBackground()}>
      <main>
        <div className="timer-box">
          <h1 className="timer-style">
            {displayTimer()}
          </h1>
          <div className="title">{timerType}</div>
        </div>
        <div className="button-layout">
          <button className="start" onClick={() => setTimerState(true)}>
            <div className="button-size">Start</div>
          </button>
          <button className="stop" onClick={() => setTimerState(false)}>
            <div className="button-size">Stop</div>
          </button>
          <button className="reset" onClick={() => resetTimer()}>
            <div className="button-size">Reset</div>
          </button>
          <audio id="alarm">
            <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
          </audio>
        </div>
      </main>
    </div>
    
  );
}

export default App;
