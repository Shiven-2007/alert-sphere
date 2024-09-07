"use client";
import Image from "next/image";
import "./page.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import React from "react";
import mapboxgl from "mapbox-gl";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [warnings, setWarnings] = useState([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [cord, updateCord] = useState([]);

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const mapContainerRef = useRef();
  // this.mapContainerRef = React.createRef();
  const mapRef = useRef();

  function mcoord(x) {
    const marker = new mapboxgl.Marker()
      .setLngLat([x[1], x[0]])
      .addTo(mapRef.current);
      
/*
    if (!mapContainerRef.current) return;

    const size = 200;
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(0, 0, this.width, this.height).data;

        mapRef.current.triggerRepaint();

        return true;
      },
    };

    mapRef.current.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

    mapRef.current.addSource("dot-point", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: x,
            },
          },
        ],
      },
    });

    mapRef.current.addLayer({
      id: "layer-with-pulsing-dot",
      type: "symbol",
      source: "dot-point",
      layout: {
        "icon-image": "pulsing-dot",
      },
    });
    */
  }

  useEffect(() => {
    //mapboxgl.accessToken = 'pk.eyJ1IjoibWFuYW4xMDEwMTAiLCJhIjoiY20wbTR6bXNzMGQ0NDJpcXo4bDRhYWo3NSJ9.24fXRkHUe0_GIAPoaXXIUQ';
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (mapRef.current) return;
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [0, 0],
      zoom: 3,
      style: "mapbox://styles/mapbox/streets-v12",
    });
    const size = 200;

    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(0, 0, this.width, this.height).data;

        mapRef.current.triggerRepaint();

        return true;
      },
    };

    mapRef.current.on("load", () => {
      mapRef.current.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

      mapRef.current.addSource("dot-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [0, 0],
              },
            },
          ],
        },
      });

      mapRef.current.addLayer({
        id: "layer-with-pulsing-dot",
        type: "symbol",
        source: "dot-point",
        layout: {
          "icon-image": "pulsing-dot",
        },
      });
    });

    // MAP ENDS

    async function fetchContacts() {
      const { data, error } = await supabase.from("contacts").select();

      if (error) {
        console.error(error);
      } else {
        setContacts(data);
        console.log(data);
      }
    }

    async function fetchData() {
      const { data, error } = await supabase.from("sample").select();

      if (error) {
        console.log(error);
      } else {
        setWarnings(data);
        data.forEach((item) => {
          setPlaces((prevPlaces) => {
            // Only add the place if it's not already in the array
            if (!prevPlaces.includes(item.place)) {
              return [...prevPlaces, item.place];
            }
            return prevPlaces; // Return the current state if the place already exists
          });
        });
      }
      setLoading(false);
    }

    fetchData();
    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/disaster-data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setRealTimeUpdates(data["gdacs_rss_feed"].slice(0, 6));
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };
    fetchData();

    // Set up the interval
    const intervalId = setInterval(fetchData, 300000); // 300000 ms = 5 minutes

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
  };

  return (
    <>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css"
        rel="stylesheet"
      />
      <title>Sachet - Global Disaster Alerts</title>

      <header className={"header"}>
        <div className="header-container">
          <div className="logo text-2xl flex-1">
            <span>Alert</span>
            <span>Sphere</span>
          </div>
          <nav className={"nav flex-2"}>
            <ul className="nav-links">
              {/*<li>*/}
              {/*  <a href="#hero">Home</a>*/}
              {/*</li>*/}
              {/*<li>*/}
              {/*  <a href="#services">Services</a>*/}
              {/*</li>*/}
              <li>
                <a href="#map-section">Map</a>
              </li>
              <li>
                <a href="#curr">Realtime Alerts</a>
              </li>
              <li>
                <a href="#pred">Predicted Alerts</a>
              </li>
              <li>
                <a href="#contact">Emergency Contacts</a>
              </li>
              <li>
                <Link href={"/checklist"} className={"chk"}>
                  <button>Precautions</button>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex-1"></div>
        </div>
      </header>
      <main>
        <section id="hero">
          <h1>Welcome to AlertSphere - Global Disaster Alerts</h1>
          <p>
            Your one-stop platform for global disaster alerts and information.
          </p>
        </section>

        <div className={"w-[90vw] mx-auto flex"}>
          <section id="map-section" className="flex-1 grow-[2]">
            <h2>Global Disaster Map</h2>
            {/*<Map id="map"/>*/}
            <div id="map" className="map-container" ref={mapContainerRef}></div>
          </section>
          <div className="flex-1 grow-[1]">
            <h2 className={"fuhe"} id={"curr"}>Current Alerts</h2>
            <ul className="alert-list">
              {
                <ul>
                  {realTimeUpdates.map((item, index) => (
                    <li key={index} onClick={mcoord([item.geo_lat, item.geo_long])}>{item.title}</li>
                  ))}
                </ul>
              }
              
            </ul>
          </div>
        </div>
        <div className="flex justify-evenly mt-10 gap-10 px-10">
          <section className="alerts flex-1">
            <h2 className={"fuhe"} id={"pred"}>Predicted Alerts</h2>
            <select
              className="text-black bg-white"
              value={selectedPlace}
              onChange={handlePlaceChange}
            >
              <option value="">Select a region</option>
              {places.map((ePlace, index) => {
                return (
                  <option
                    key={index}
                    value={ePlace}
                    className={poppins.className}
                  >
                    {ePlace}
                  </option>
                );
              })}
            </select>

            <ul className="alert-list">
              {warnings
                .filter((alert) => {
                  // If no place is selected, return all warnings
                  if (!selectedPlace) return true;
                  // Otherwise, filter by the selected place
                  return alert.place === selectedPlace;
                })
                .map((alert, key) => (
                  <li
                    key={key}
                  >
                    {alert.country} : {alert.disaster} in {alert.month}st month
                  </li>
                ))}
            </ul>
          </section>
          <section id="contact" className="flex-1">
            <h2>Emergency Contacts</h2>

            <select
              className="text-black bg-white"
              value={selectedPlace}
              onChange={handlePlaceChange}
            >
              <option value="">Select a region</option>
              {places.map((ePlace, index) => {
                return (
                  <option
                    key={index}
                    value={ePlace}
                    className={poppins.className}
                  >
                    {ePlace}
                  </option>
                );
              })}
            </select>

            <ul id="contact-list">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link href={"tel:" + contact.phone}>
                    {contact.name} - {contact.phone} - {contact.region}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className={"footer"}>
        <p>© 2024 AlertSphere. All rights reserved.</p>
      </footer>
      <div id="particles-js" />
    </>
  );
}
