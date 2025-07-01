import React, { useState, useEffect } from "react";
import ImageData from 'next/image'

export const ImageComponent = React.memo((props) => {
    const {
        parentClass,
        parentStyle,
        imageProps = {}
    } = props;
    const {
        src,
        width,
        height,
        alt,
        style,
        custom,
        maxWidth,
        text,
        ...restProps
    } = imageProps;
    const [imageError, setImageError] = useState(false);
    const [dimensions, setDimensions] = useState({ width: width, height: width });

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
    }, [src]);

    const imageLoader = ({ src }) => {
        const japaneseText = text ? encodeURIComponent(text) : "";
        if (imageError || !src) {
            return text ? `https://dummyimage.com/${width}x${height}?text=${japaneseText}` : `https://dummyimage.com/${width}x${height}`;
        }
        return src;
    };


    return (
        <div className={`${parentClass}`}>
            <ImageData
                src={imageLoader({ src })}
                width={custom ? (dimensions.width > maxWidth ? maxWidth : dimensions.width) : width}
                alt={alt}
                height={custom ? dimensions.height : height}
                maxWidth={custom ? maxWidth : ''}
                loader={imageLoader}
                onLoadingComplete={(res)=>{
                    if(res.naturalWidth === 0 || res.naturalHeight === 0) {
                        setImageError(true);
                    }
                    setImageError(false);
                }}
                {...restProps}
            />
        </div>
    );
});
ImageComponent.displayName = 'ImageComponent';