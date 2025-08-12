import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow } from "lucide-react";
import React from "react";

const WeatherIcon = ({ type }: { type: string }) => {
  if (type == "Sunny") {
    return (
      <div className="grid grid-cols-2 gap-3 justify-evenly items-center">
        <p className="text-xl">Sunny</p>
        <Sun size={30} color="#fff" />
      </div>
    );
  } else if (type == "Rainy") {
    return (
      <div className="grid grid-cols-2 gap-3 justify-evenly items-center">
        <p>Rainy</p>
        <CloudRain size={24} color="#fff" />
      </div>
    );
  } else if (type == "Cloudy") {
    return (
      <div className="grid grid-cols-2 gap-3 justify-evenly items-center">
        <p>Cloudy</p>
        <Cloud size={24} color="#fff" />
      </div>
    );
  }
};

export const DailyCard = ({
  type,
  lowT,
  highT,
  wind,
  prec,
  dir
}: {
  type: string;
  lowT: number;
  highT: number;
  wind: string;
  prec: number;
  dir: string;
}) => {
  if (type === "Sunny") {
    return (
      <div className="sunback rounded-2xl min-w-[400px] max-w-[500px]">
        <Card
          isBlurred
          className="bg-background/50 dark:bg-default-100/15 w-full border-1"
        >
          <CardHeader className="flex flex-row justify-evenly">
            <div className="grid grid-cols-2 gap-3 justify-evenly items-center">
              <p className="text-xl">Sunny</p>
              <Sun size={30} color="#fff" />
            </div>
            <div className="flex flex-col">
              <p className="text-md">Low: {lowT}&#176;C</p>
              <p className="text-lg">High: {highT}&#176;C</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-row justify-between">
              <p>Wind: {wind} km/h</p>
              <p>Direction: {dir}</p>
              <p>Precipitation: {prec}mm</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  } else if (type == "Rainy") {
    return (
      <div className="rainback rounded-2xl min-w-[400px] max-w-[500px]">
        <Card
          isBlurred={true}
          className="bg-background/60 dark:bg-default-100/50 min-w-[350px] w-full border-1"
        >
          <CardHeader className="flex flex-row justify-evenly">
            <div className="grid grid-cols-2 gap-3 justify-evenly items-center">
              <p>Rainy</p>
              <CloudRain size={24} color="#fff" />
            </div>
            <div className="flex flex-col">
              <p className="text-md">Low: {lowT}&#176;C</p>
              <p className="text-lg">High: {highT}&#176;C</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-row justify-between">
              <p>Wind: {wind} km/h</p>
              <p>Direction: {dir}</p>
              <p>Precipitation: {prec}mm</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  } else if (type === "Cloudy") {
    return (
      <div className="cloudback rounded-2xl min-w-[400px] max-w-[500px]">
        <Card
          isBlurred={true}
          className="bg-background/60 dark:bg-default-100/50 min-w-[350px] w-full border-1"
        >
          <CardHeader className="flex flex-row justify-evenly">
            <div className="grid grid-cols-2 gap-3 justify-evenly items-center">
              <p>Cloudy</p>
              <Cloud size={24} color="#fff" />
            </div>
            <div className="flex flex-col">
              <p className="text-md">Low: {lowT}&#176;C</p>
              <p className="text-lg">High: {highT}&#176;C</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-row justify-between">
              <p>Wind: {wind} km/h</p>
              <p>Direction: {dir}</p>
              <p>Precipitation: {prec}mm</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
};
