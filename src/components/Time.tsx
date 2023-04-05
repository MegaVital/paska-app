import { Typography } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";

type Time = {}

export const Time: FunctionComponent<Time> = () => {

    const [time, setTime] = useState('')
    useEffect(() => { setInterval(() => { setTime(new Date().toLocaleTimeString()) }, 1000) })

    return (
        <Typography
            component="div" sx={{ mr: 3, display: { lg: 'block', xs: 'none' } }}>{new Date().toLocaleDateString()} {time}</Typography>
    )
}