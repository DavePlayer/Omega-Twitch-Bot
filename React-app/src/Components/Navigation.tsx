import React from "react";
import { Link } from "react-router-dom";

export const Navigation: React.FC = () => {
    return (
        <nav>
            <ol>
                <Link to="/">
                    <li>Timer</li>
                </Link>
                <Link to="/shortcuts">
                    <li>Soundboard</li>
                </Link>
                <Link to="/Donate">
                    <li>Robux Donate</li>
                </Link>
            </ol>
        </nav>
    );
};
