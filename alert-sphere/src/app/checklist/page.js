'use client'
import React, {useEffect} from 'react';
import Earthquake from "@/components/disasters/Earthquake";
import Flood from "@/components/disasters/Flood";

const Page = (props) => {
    const {disaster} = props
    /* **//*
    useEffect(() => {
        if (disaster === "earthquake") {
            return (
                <>
                <h1>Checklist</h1>
                    <Earthquake />
                </>
            )
        } else {
            return (
                <>
                    <h1>Checklist</h1>
                    <Flood />
                </>
            )
        }
    }, []);
    /**//**/
    return (
        <div>
            <h1>Checklist</h1>
            <Earthquake />
            <Flood />
        </div>
    );
};

export default Page;