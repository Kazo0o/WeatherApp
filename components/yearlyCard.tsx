import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { CloudRain, Sun, Wind } from "lucide-react";

interface YearlyCardProps {
    year: string;
    temp: number;
    rain: number;
    wind: number;
}

export const YearlyCard = (props: YearlyCardProps) => {
  return (
    <Card key={props.year} className="max-w-xs">
        <CardHeader className="flex justify-center">
            <p className="text-xl">{props.year}</p>
        </CardHeader>
        <Divider />
        <CardBody className="flex items-center">
            <div className="flex flex-row gap-2 my-2">
                <p>Average Temperature: {props.temp.toFixed(2)} °C</p>
                <Sun size={24} />
            </div>
            <Divider />
            <div className="flex flex-row gap-2 my-2">
                <p>Average Rainfall: {props.rain.toFixed(2)} mm</p>
                <CloudRain size={24} />
            </div>
            <Divider />
            <div className="flex flex-row gap-2 my-2">
                <p>Average Wind: {props.wind.toFixed(2)} km/h</p>
                <Wind size={24} />
            </div>
        </CardBody>
    </Card>
  )
}