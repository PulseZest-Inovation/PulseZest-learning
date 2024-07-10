'use client'
import React, { useRef } from "react";

const HeroSection = () => {
    const heroSectionStyle = {
        backgroundColor: "#D3F4A1", // Light lime green background color
        position: "relative",
        width: "100%",
        height: "400px", // Adjust height as needed
        display: "flex",
        flexDirection: "column", // Adjusted to column layout
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", // Added padding for spacing
    };

    const dotStyle = {
        position: "absolute",
        top: "50px", // Adjust top position for the rectangle
        left: "50px", // Adjust left position for the rectangle
        width: "300px", // Adjust width of the rectangle
        height: "200px", // Adjust height of the rectangle
        backgroundColor: "white",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1%, rgba(255,255,255,0) 1%)",
        backgroundSize: "10px 10px", // Dot size
        zIndex: "-1",
    };

    const coursesRef = useRef(null);

    const handleExploreCourses = () => {
        coursesRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div style={heroSectionStyle}>
            <h1>Find Your Perfect Course</h1>
            <p>Explore a wide range of courses tailored for you.</p>
            <button onClick={handleExploreCourses}>Explore Courses</button>
            <div style={dotStyle}></div>
            <div ref={coursesRef}></div>
        </div>
    );
};

export default HeroSection;
