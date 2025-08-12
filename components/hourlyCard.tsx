import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudSun, CloudRainWind, CloudSunRain, CloudFog, CloudHail, CloudLightning } from "lucide-react";
import React from "react";

interface WeatherType {
  name: string;
  component: string;
}
interface WeeatherTypesMap {
  [key: string]: WeatherType; // This is the index signature
}

// Create a type for the Lucide Icon components
type LucideIconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

const weather_type: WeeatherTypesMap = {
  "0": {
    "name": "Clear",
    "component": "Sun"
  },
  "1": {
    "name": "Mostly Clear",
    "component": "CloudSun"
  },
  "2": {
    "name": "Partly Clear",
    "component": "CloudSun"
  },
  "3": {
    "name": "Overcast",
    "component": "Cloud"
  },
  "45": {
    "name": "Fog",
    "component": "CloudFog"
  },
  "48": {
    "name": "Icy Fog",
    "component": "CloudFog"
  },
  "51": {
    "name": "Light Drizzle",
    "component": "CloudDrizzle"
  },
  "53": {
    "name": "Drizzle",
    "component": "CloudDrizzle"
  },
  "55": {
    "name": "Heavy Drizzle",
    "component": "CloudDrizzle"
  },
  "80": {
    "name": "Light Showers",
    "component": "CloudRain"
  },
  "81": {
    "name": "Showers",
    "component": "CloudRain"
  },
  "82": {
    "name": "Heavy Showers",
    "component": "CloudRain"
  },
  "61": {
    "name": "Light Rain",
    "component": "CloudRain"
  },
  "63": {
    "name": "Rain",
    "component": "CloudRain"
  },
  "65": {
    "name": "Heavy Rain",
    "component": "CloudRain"
  },
  "56": {
    "name": "Light Freezing Drizzle",
    "component": "CloudDrizzle"
  },
  "57": {
    "name": "Freezing Drizzle",
    "component": "CloudDrizzle"
  },
  "66": {
    "name": "Light Freezing Rain",
    "component": "CloudRain"
  },
  "67": {
    "name": "Freezing Rain",
    "component": "CloudRain"
  },
  "77": {
    "name": "Snow Grains",
    "component": "CloudSnow"
  },
  "85": {
    "name": "Light Snow Showers",
    "component": "CloudSnow"
  },
  "86": {
    "name": "Snow Showers",
    "component": "CloudSnow"
  },
  "71": {
    "name": "Light Snow",
    "component": "CloudSnow"
  },
  "73": {
    "name": "Snow",
    "component": "CloudSnow"
  },
  "75": {
    "name": "Heavy Snow",
    "component": "CloudSnow"
  },
  "95": {
    "name": "Thunderstorm",
    "component": "CloudLightning"
  },
  "96": {
    "name": "Light T-storm w/ Hail",
    "component": "CloudLightning"
  },
  "99": {
    "name": "T-storm w/ Hail",
    "component": "CloudLightning"
  }
}

// Create a mapping object for your Lucide icons by their component names
// This is your 'componentMap' but specifically for Lucide icons
const lucideIconMap: { [key: string]: LucideIconComponent | undefined } = {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudSun,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRainWind, // Make sure 'lucide-react' actually exports this
  CloudSunRain   // Make sure 'lucide-react' actually exports this
};


export const HourlyCard = ({
    time,
  type,
  temp,
  wind,
  prec,
  dir,
  timezone
}: {
    time:string;
  type: number;
  temp: number;
  wind: number;
  prec: number;
  dir: number;
  timezone: string;
}) => {
  const date = new Date(time);
  const cd = new Intl.DateTimeFormat("en-ZA", {dateStyle: "full",
    timeStyle: "long",
    timeZone: timezone
  }).format(date);

  const weatherInfo = weather_type[String(type)];

  if(!weatherInfo){
    return (
      <p>
        Error: Weather type code "{type}" not found.
        <br />
        Please check your data source or the 'weather_type' object
      </p>
    )
  }

  const lucideIconName: string = weatherInfo.component; // e.g., "Sun", "CloudRain"

  // Get the actual Lucide React component from our map
  const IconComponent = lucideIconMap[lucideIconName];


  if (!IconComponent) {
    return (
      <p>
        Error: Lucide icon "{lucideIconName}" not found or not mapped for code {type}.
        <br/>
        Please check your JSON `component` names match Lucide React's export names.
      </p>
    );
  }

  return (
      <div className={`wc-${type} rounded-2xl min-w-[600px] mb-3`}>
        <Card
          isBlurred
          className="bg-background/50 dark:bg-default-100/15 w-full border-1"
        >
          <CardHeader className="grid grid-flow-row grid-rows-2 gap-4 items-center justify-center">
            <div>
            <h3 className="text-xl text-center">{cd}</h3>
            </div>
            <div className="grid grid-flow-col grid-cols-2 justify-evenly items-center">
            <div className="flex flex-row gap-2">
              <p className="text-xl">{weatherInfo.name}</p>
              <IconComponent fontSize={30} color="#fff" />
            </div>
            <div>
              <p className="text-lg">Temperature: {temp}&#176;C</p>
            </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-row justify-between">
              <p>Wind: {wind} km/h</p>
              <p>Direction: {dir}&#176;</p>
              <p>Precipitation: {prec}mm</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  // if (type === 0) {
  //   return (
  //     <div className="sunback rounded-2xl min-w-[600px] mb-3">
  //       <Card
  //         isBlurred
  //         className="bg-background/50 dark:bg-default-100/15 w-full border-1"
  //       >
  //         <CardHeader className="grid grid-flow-row grid-rows-2 gap-4 items-center justify-center">
  //           <div>
  //           <h3 className="text-xl text-center">{cd}</h3>
  //           </div>
  //           <div className="grid grid-flow-col grid-cols-2 justify-evenly items-center">
  //           <div className="flex flex-row gap-2">
  //             <p className="text-xl">Clear</p>
  //             <Sun size={30} color="#fff" />
  //           </div>
  //           <div>
  //             <p className="text-lg">Temperature: {temp}&#176;C</p>
  //           </div>
  //           </div>
  //         </CardHeader>
  //         <Divider />
  //         <CardBody>
  //           <div className="flex flex-row justify-between">
  //             <p>Wind: {wind} km/h</p>
  //             <p>Direction: {dir}&#176;</p>
  //             <p>Precipitation: {prec}mm</p>
  //           </div>
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // }else if (type === 2) {
  //   return (
  //     <div className="pcloudback rounded-2xl min-w-[600px] max-w-[700px] mb-5">
  //       <Card
  //         isBlurred={true}
  //         className="bg-background/60 dark:bg-default-100/50 w-full border-1"
  //       >
  //         <CardHeader className="grid grid-flow-row grid-rows-2 gap-4 items-center justify-center">
  //           <div>
  //           <h3 className="text-xl text-center">{cd}</h3>
  //           </div>
  //           <div className="grid grid-flow-col grid-cols-2 justify-evenly items-center">
  //           <div className="flex flex-row gap-2">
  //             <p className="text-xl">Partly Cloudy</p>
  //             <CloudSun size={30} color="#fff" />
  //           </div>
  //           <div>
  //             <p className="text-lg">Temperature: {temp}&#176;C</p>
  //           </div>
  //           </div>
  //         </CardHeader>
  //         <Divider />
  //         <CardBody>
  //           <div className="flex flex-row justify-between">
  //             <p>Wind: {wind} km/h</p>
  //             <p>Direction: {dir}&#176;</p>
  //             <p>Precipitation: {prec}mm</p>
  //           </div>
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // } else if (type == 63) {
  //   return (
  //     <div className="rainback rounded-2xl min-w-[450px] max-w-[500px] mb-5">
  //       <Card
  //         isBlurred={true}
  //         className="bg-background/60 dark:bg-default-100/50 min-w-[350px] w-full border-1"
  //       >
  //         <CardHeader className="grid grid-flow-row grid-rows-2 gap-4 items-center justify-center">
  //           <div>
  //           <h3 className="text-xl text-center">{cd}</h3>
  //           </div>
  //           <div className="grid grid-flow-col grid-cols-2 justify-evenly items-center">
  //           <div className="flex flex-row gap-2">
  //             <p className="text-xl">Rainy</p>
  //             <CloudRain size={30} color="#fff" />
  //           </div>
  //           <div>
  //             <p className="text-lg">Temperature: {temp}&#176;C</p>
  //           </div>
  //           </div>
  //         </CardHeader>
  //         <Divider />
  //         <CardBody>
  //           <div className="flex flex-row justify-between">
  //             <p>Wind: {wind} km/h</p>
  //             <p>Direction: {dir}&#176;</p>
  //             <p>Precipitation: {prec}mm</p>
  //           </div>
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // }else if (type == 73) {
  //   return (
  //     <div className="snowback rounded-2xl min-w-[450px] max-w-[500px] mb-5">
  //       <Card
  //         isBlurred={true}
  //         className="bg-background/60 dark:bg-default-100/50 min-w-[350px] w-full border-1"
  //       >
  //         <CardHeader className="grid grid-flow-row grid-rows-2 gap-4 items-center justify-center">
  //           <div>
  //           <h3 className="text-xl text-center">{cd}</h3>
  //           </div>
  //           <div className="grid grid-flow-col grid-cols-2 justify-evenly items-center">
  //           <div className="flex flex-row gap-2">
  //             <p className="text-xl">Snowy</p>
  //             <CloudSnow size={30} color="#fff" />
  //           </div>
  //           <div>
  //             <p className="text-lg">Temperature: {temp}&#176;C</p>
  //           </div>
  //           </div>
  //         </CardHeader>
  //         <Divider />
  //         <CardBody>
  //           <div className="flex flex-row justify-between">
  //             <p>Wind: {wind} km/h</p>
  //             <p>Direction: {dir}&#176;</p>
  //             <p>Precipitation: {prec}mm</p>
  //           </div>
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // }else if (type == 81) {
  //   return (
  //     <div className="showersback rounded-2xl min-w-[450px] max-w-[500px] mb-5">
  //       <Card
  //         isBlurred={true}
  //         className="bg-background/60 dark:bg-default-100/50 min-w-[350px] w-full border-1"
  //       >
  //         <CardHeader className="grid grid-flow-row grid-rows-2 gap-4 items-center justify-center">
  //           <div>
  //           <h3 className="text-xl text-center">{cd}</h3>
  //           </div>
  //           <div className="grid grid-flow-col grid-cols-2 justify-evenly items-center">
  //           <div className="flex flex-row gap-2">
  //             <p className="text-xl">Showers</p>
  //             <CloudRain size={30} color="#fff" />
  //           </div>
  //           <div>
  //             <p className="text-lg">Temperature: {temp}&#176;C</p>
  //           </div>
  //           </div>
  //         </CardHeader>
  //         <Divider />
  //         <CardBody>
  //           <div className="flex flex-row justify-between">
  //             <p>Wind: {wind} km/h</p>
  //             <p>Direction: {dir}&#176;</p>
  //             <p>Precipitation: {prec}mm</p>
  //           </div>
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // }
};
