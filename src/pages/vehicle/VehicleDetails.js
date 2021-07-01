import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function VehicleDetails () {
    const {code} = useParams();

    useEffect(() => {
        console.log(code);
    });

    return (
        <></>
    );
}