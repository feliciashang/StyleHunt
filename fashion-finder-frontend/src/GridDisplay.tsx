import React from "react";
import './GridDisplay.css'

interface Props {
    items: [string, string, string][];
    similarItems: [string, string][];
}

const GridDisplay: React.FC<Props> = ({ items, similarItems }) => {
    return (
        <div>
            <p className="subtitle">Fully matching pages</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {items.map(([imageUrl, pageUrl, price], index) => (
                    <div
                        key={index}
                        className="grid-item h-72 flex flex-col justify-start"
                    >
                        <p className="pricetag px-2 pt-2">{price}</p>
                        <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="w-full px-2 pb-2">
                            <div className="w-full h-48 overflow-hidden rounded-lg border">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <p className="subtitle">Similar matching pages</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {similarItems.map(([imageUrl, pageUrl], index) => (
                    <div key={index} className="grid-item h-72 flex flex-col justify-start">
                        <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="w-full px-2 pb-2">
                            <div className="w-full h-48 overflow-hidden rounded-lg border">
                                <img src={imageUrl}
                                        className="w-full h-full object-cover"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            (e.target as HTMLImageElement).src = '/image-fallback.jpg'}}
                                />
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GridDisplay;