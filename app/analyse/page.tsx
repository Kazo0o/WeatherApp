"use client";
import { DatePicker, Button, CircularProgress } from "@heroui/react";
import React, { useState } from "react";
import { MonthlyCard } from "@/components/monthlyCard";
import { YearlyCard } from "@/components/yearlyCard";

type YearlyData = {
  [year: string]: {
    temp: number;
    rain: number;
    wind: number;
  };
};

type MonthlyData = {
  [year: string]: {
    [month: string]: {
      temp: number;
      rain: number;
      wind: number;
    };
  };
};

function Analyse() {
  const [yearly, setYearly] = useState<YearlyData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const getMonthlyData = async () => {
    const response = await fetch(
      `http://localhost:3000/api/monthly_averages/${start}/${end}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setMonthly(data);
    } else {
      const error = response.statusText;
      setError(error);
    }
  };

  const handlePress = async () => {
    setIsLoading(true);
    await getYearlyData();
    await getMonthlyData();
    setIsLoading(false);
  };

  return (
    <main>
      <div>
        <h1 className="text-4xl text-center">Historical Analysis</h1>

        <h2 className="text-2xl text-center my-5">
          Choose the range of dates:
        </h2>
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
          <Button type="submit" isLoading={isLoading} onPress={handlePress}>
            {isLoading ? "Loading..." : "Get Data"}
          </Button>
        </div>

        <h2 className="text-2xl text-center my-5">Results</h2>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress label="Loading..." aria-label="Loading..." />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
          <h3 className="text-xl text-center my-5">Yearly Data</h3>
            <div className="grid gap-2 items-center justify-center sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
            {yearly &&
              Object.keys(yearly).map((year) => (
                <YearlyCard
                  key={`${year}-${yearly[year].temp}`}
                  year={year}
                  temp={yearly[year].temp}
                  rain={yearly[year].rain}
                  wind={yearly[year].wind}
                />
              ))}
              </div>
              <h3 className="text-xl text-center my-5">Monthly Data</h3>
              <div className="grid gap-2 items-center justify-center sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">

            {monthly &&
              Object.keys(monthly).map((year) =>
                Object.keys(monthly[year]).map((month) => (
                  <MonthlyCard
                    key={`${year}-${month}`}
                    year={year}
                    month={month}
                    temp={monthly[year][month].temp}
                    rain={monthly[year][month].rain}
                    wind={monthly[year][month].wind}
                  />
                ))
              )}
          </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Analyse;
