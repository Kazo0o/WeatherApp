import React from "react";

const getCurrentData = async () => {
  const res = await fetch("http://localhost:3000/api/current");
  return res.json();
};

const getHisoryHourly = async () => {
  const res = await fetch("http://localhost:3000/api/history_hourly");
  return res.json();
};

const getYearlyAvgs = async() => {
    const res = await fetch("http://localhost:3000/api/yearly_averages");
    return res.json();
}
async function Analyse(){

    const yearlyAvgs = await getYearlyAvgs();

//   const loc = await fetch(
//     `https://nominatim.openstreetmap.org/reverse?lat=${cData.lat}&lon=${cData.lon}&format=json`
//   );

//   const locData = await loc.json();
    return(
        <main>
            <div>
                <h1>Historically:</h1>
            </div>
        </main>
    )
}

export default Analyse;