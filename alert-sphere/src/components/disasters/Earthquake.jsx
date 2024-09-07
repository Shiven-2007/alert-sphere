"use client";
import { React, useState } from 'react';
import './checklist.css'; // Import the CSS file

const EarthquakeChecklist = () => {
    // State to manage checked items
    const [checkedItems, setCheckedItems] = useState({});

    // Toggle the checked state of an item
    const handleCheck = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    // Page items grouped by sections
    const checklist = {
        'Before an Earthquake': [
            'Develop a family emergency plan',
            'Prepare an emergency kit with essentials',
            'Secure heavy furniture and appliances',
            'Know how to turn off gas, electricity, and water',
            'Identify safe spots in your home and plan evacuation routes',
            'Set up a communication plan with family members',
        ],
        'During an Earthquake': [
            'Drop, Cover, and Hold On',
            'Stay indoors until the shaking stops',
            'Move to an open area if outdoors',
            'Pull over to a safe location if driving',
        ],
        'After an Earthquake': [
            'Check for injuries and provide first aid',
            'Inspect for hazards like gas leaks and fires',
            'Use text messages to communicate your safety',
            'Expect aftershocks and be prepared',
            'Avoid entering damaged buildings',
            'Be prepared to evacuate if necessary',
        ],
    };

    return (
        <div className="checklist-container">
            <h1>Earthquake Preparedness Checklist</h1>
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

export default EarthquakeChecklist;