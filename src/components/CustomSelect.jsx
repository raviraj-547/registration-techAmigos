"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "Select",
    required = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        // Simulate standard event object for compatibility with parent handler
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || value || placeholder;

    return (
        <div className="form-group" ref={containerRef}>
            {label && <label>{label}</label>}

            <div className="custom-select-wrapper">
                <div
                    className={`custom-select-trigger ${isOpen ? "open" : ""} ${value ? "has-value" : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{selectedLabel}</span>
                    <ChevronDown
                        size={18}
                        className={`select-arrow ${isOpen ? "rotated" : ""}`}
                    />
                </div>

                {isOpen && (
                    <div className="custom-options">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`custom-option ${value === option.value ? "selected" : ""}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <Check size={16} className="text-secondary" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hidden input to ensure native form validation works (if needed) behavior usually requires real input but we are controlled */}
            <input
                type="text"
                name={name}
                value={value}
                required={required}
                onChange={() => { }}
                style={{ display: "none" }}
            />
        </div>
    );
}
