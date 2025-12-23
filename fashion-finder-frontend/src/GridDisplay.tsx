import React from "react";
import './GridDisplay.css'

interface Props {
    items: string[];
}

const GridDisplay: React.FC<Props> = ({ items }) => {
    return (
        <div className="grid grid-cols-3 gap-4 mt-8">
            {items.map((imageUrl, index) => (
                <div key={index} className="grid-item">
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            src={imageUrl}
                            className="w-full h-auto object-contain rounded-lg border"
                        />
                    </a>
                </div>
            ))}
        </div>
    )
}

export default GridDisplay;