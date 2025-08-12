"use client";
import { DatePicker, Button } from "@heroui/react";
import React, { useState } from "react";
import { YearlyCard } from "@/components/yearlyCard";

const getCurrentData = async () => {
  const res = await fetch("http://localhost:3000/api/current");
  return res.json();
};

const getHisoryHourly = async () => {
  const res = await fetch("http://localhost:3000/api/history_hourly");
  return res.json();
};

const getYearlyAvgs = async () => {
  const res = await fetch("http://localhost:3000/api/yearly_averages");
  return res.json();
};
type YearlyData = {
  [year: string]: {
    temp: number;
    rain: number;
    wind: number;
  };
};

function Analyse() {
  const [yearly, setYearly] = useState<YearlyData | null>(null);
  const [monthly, setMonthly] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  const getYearlyData = async () => {
    const response = await fetch(
      `http://localhost:3000/api/yearly_averages/${start}/${end}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setYearly(data);
    } else {
      const error = response.statusText;
      setError(error);
    }
  };

  //   const loc = await fetch(
  //     `https://nominatim.openstreetmap.org/reverse?lat=${cData.lat}&lon=${cData.lon}&format=json`
  //   );

  //   const locData = await loc.json();
  return (
    <main>
      <div>
        <h1 className="text-4xl text-center">Historical Analysis</h1>

        <h2 className="text-2xl text-center my-5">Choose the range of dates:</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 my-5">
          <DatePicker
            label="Start Date"
            className="max-w-2xs"
            showMonthAndYearPickers
            onChange={(e) => setStart(e ? e.toString() : "")}
          />
          <DatePicker
            label="End Date"
            className="max-w-2xs"
            showMonthAndYearPickers
            onChange={(e) => setEnd(e ? e.toString() : "")}
          />
          <Button onClick={getYearlyData}>
            <p>Get Data</p>
          </Button>
        </div>


        <h2 className="text-2xl text-center my-5">Results</h2>
        <div className="grid gap-2 items-center justify-center sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
        {error && <p className="text-red-500">An error occurred: {error}</p>}
        {yearly &&
          Object.keys(yearly).map((year) => (

              <YearlyCard year={year} temp={yearly[year].temp} rain={yearly[year].rain} wind={yearly[year].wind} />

          ))}
          </div>
      </div>
    </main>
  );
}

export default Analyse;
