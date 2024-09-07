"use client";
import React, { useState } from 'react';
import './checklist.css'; // Import the CSS file

const FloodChecklist = () => {
    // State to manage checked items
    const [checkedItems, setCheckedItems] = useState({});

    // Toggle the checked state of an item
    const handleCheck = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    // Checklist items grouped by sections
    const checklist = {
        'Before a Flood': [
            'Know your flood risk and evacuation routes',
            'Prepare an emergency kit with essentials',
            'Purchase flood insurance if in a high-risk area',
            'Elevate electrical appliances and utilities',
            'Install check valves to prevent water backup',
            'Keep important documents in a waterproof container',
        ],
        'During a Flood': [
            'Listen to emergency broadcasts and follow instructions',
            'Move to higher ground or evacuate if advised',
            'Avoid walking or driving through floodwaters',
            'Turn off utilities if instructed',
            'Move valuable items to higher levels',
        ],
        'After a Flood': [
            'Avoid floodwaters due to contamination risks',
            'Check for structural damage before entering buildings',
            'Photograph damage for insurance claims',
            'Clean and disinfect everything that got wet',
            'Report downed power lines to authorities',
            'Use generators outdoors only and away from windows',
        ],
    };

    return (
        <div className="checklist-container">
            <h1>Flood Preparedness Checklist</h1>
            {Object.keys(checklist).map((section) => (
                <div key={section} className="section">
                    <h2>{section}</h2>
                    <ul>
                        {checklist[section].map((item, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name={`${section}-${index}`}
                                        checked={checkedItems[`${section}-${index}`] || false}
                                        onChange={handleCheck}
                                    />
                                    {item}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default FloodChecklist;