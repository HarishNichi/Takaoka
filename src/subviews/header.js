"use client";

import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

const Header = ({ onBackClick, title, ariaLabel }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { }, [onBackClick, title, ariaLabel]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBackClick(e);
        }
    };

    return (
        <div style={{
            width: "100%",
            backgroundColor: "#c8193c",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "200",
        }}>
            <button
                onClick={onBackClick}
                onKeyDown={handleKeyDown}
                className="back-button"
                aria-label={ariaLabel || "Go back"}
                role="button"
                tabIndex={0}
            >
                <Image 
                    color="white" 
                    width={40} 
                    height={30} 
                    src="/arrow_back.svg" 
                    alt="Back arrow" 
                    aria-hidden="true"
                />
            </button>
            <div style={{ marginLeft: "-10px", fontWeight: 500 }}>{title}</div>
            <div style={{ padding: "0 5px 0 5px" }}> Web</div>
            <div style={{ fontWeight: 500 }}>SDK</div>
        </div>
    );
};

export default Header;
