import { CurrentCard } from "@/components/currentCard";
import { HourlyCard } from "@/components/hourlyCard";
import React from "react";

const getCurrentData = async () => {
  const res = await fetch("http://localhost:3000/api/current");
  return res.json();
};

const getHourlyData = async () => {
  const res = await fetch("http://localhost:3000/api/hourly");
  return res.json();
};


async function Weather() {
  const cData = await getCurrentData();

  const hData = await getHourlyData();


  const loc = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${cData.lat}&lon=${cData.lon}&format=json`
  );

  const locData = await loc.json();

  return (
    <main>
      <div>
        <h2 className="text-xl mb-5">
          Today in {locData.address.city}, it is currently:
        </h2>
        <div className="flex justify-center">
        <CurrentCard
          temp={Math.round(cData.temp)}
          prec={Math.round(cData.prec)}
          dir={Math.round(cData.wind_dir)}
          wind={Math.round(cData.wind_speed)}
          type={cData.wcode}
          time={new Date().toString()}
          timezone={cData.timezone}
        />
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-xl mb-5">Hourly weather updates:</h2>
        <div className="flex flex-col items-center">
          {hData.map((weather:any, index:number) => (
          <div key={index}>
            <HourlyCard
              temp={Math.round(weather.temperature_2m)}
              type={Math.round(weather.weather_code)}
              dir={Math.round(weather.wind_direction_10m)}
              prec={Math.round(weather.precipitation)}
              wind={Math.round(weather.wind_speed_10m)}
              time={weather.date}
              timezone={cData.timezone}
            />
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}

export default Weather;
