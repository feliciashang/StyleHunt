import React from "react";
import './GridDisplay.css'

interface Props {
    items: [string, string][];
    similarItems: [string, string][];
}

const GridDisplay: React.FC<Props> = ({ items, similarItems }) => {
    return (
        <div>
            <p className="subtitle">Fully matching pages</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {items.map(([imageUrl, pageUrl], index) => (
                    <div key={index} className="grid-item">
                        <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={imageUrl}
                                className="w-full h-auto object-contain rounded-lg border"
                            />
                        </a>
                    </div>
                ))}
            </div>
            <p className="subtitle">Similar matching pages</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {similarItems.map(([imageUrl, pageUrl], index) => (
                    <div key={index}>
                        <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                            <img src={imageUrl}
                                className="w-full h-auto object-contain rounded-lg border"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    (e.target as HTMLImageElement).src = '/image-fallback.jpg'}}
                        />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GridDisplay;