import React from "react";
import Link from "next/link";

const FloatingActionButton = (props) => {
    const { onClick, icon, className, style, ariaLabel } = props;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
        }
    };

    return (
        <Link
            href={props.onClick ? "" : props.href}
            style={{
                position: "absolute",
                bottom: 15,
                right: 15,
                width: 60,
                height: 60,
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
            }}
            onClick={props.onClick}
            onKeyDown={handleKeyDown}
            aria-label={props.ariaLabel || "Floating action button"}
            role="button"
            tabIndex={0}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
                color="white" 
                width={30} 
                height={30} 
                src={`/${props.icon}`} 
                alt={props.ariaLabel || "Action button icon"} 
                aria-hidden="true"
            />
        </Link>
    );
};

export default FloatingActionButton;
