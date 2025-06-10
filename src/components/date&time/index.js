import React, { useContext, useEffect, useRef, useState } from 'react';
import { Calendar as Cal } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { LayoutContext, } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { NormalLabel } from "@/components"; 

export const DateTime = (props) => {
    const {
        dateTimeParentClassName,
        dateTimeParentStyle,
        labelProps,
        dateTimeClass,
        value,
        onChange,
        float,
        floatLabelProps,
        ...restProps
    } = props && props.dateTimeProps;
    const [date, setDate] = useState(props.dateTimeProps.date);
    const { localeJson } = useContext(LayoutContext);
    const calendarRef = useRef(null);
    addLocale('en', {
        firstDayOfWeek: 0,
        dayNames: [translate(localeJson, 'sunday'), translate(localeJson, 'monday'), translate(localeJson, 'tuesday'), translate(localeJson, 'wednesday'), translate(localeJson, 'thursday'), translate(localeJson, 'friday'), translate(localeJson, 'saturday')],
        dayNamesShort: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        dayNamesMin: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        monthNames: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'), translate(localeJson, 'aug'), translate(localeJson, 'sep'), translate(localeJson, 'oct'), translate(localeJson, 'nov'), translate(localeJson, 'dec')],
        monthNamesShort: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'), translate(localeJson, 'aug'), translate(localeJson, 'sep'), translate(localeJson, 'oct'), translate(localeJson, 'nov'), translate(localeJson, 'dec')],
        today: translate(localeJson, 'today'),
        clear: translate(localeJson, 'clear')
    });

    return (
        <div className={`custom_input ${dateTimeParentClassName} ${float ? 'p-float-label' : ''}`} style={dateTimeParentStyle}>
            {labelProps?.text && (
                <div className={`${labelProps.labelMainClassName || 'pb-1'}`}>
                    <NormalLabel
                        labelClass={labelProps.inputLabelClassName}
                        text={labelProps.text}
                        spanText={labelProps.spanText}
                        spanClass={labelProps.inputLabelSpanClassName}
                        htmlFor={labelProps.htmlFor}
                    />
                </div>
            )}
            <Cal className={`${dateTimeClass}`}
                showTime
                ref={calendarRef}
                value={date || value}
                onChange={(e) => {
                    setDate(e.value);
                    if (onChange) {
                        onChange(e);
                    }
                }
                }
                dateFormat={translate(localeJson, 'dateFormat')}
                panelClassName="custom-panel"
                {...restProps}
            />
            {floatLabelProps?.text && (
                <label className={`custom-label ${floatLabelProps.inputLabelClassName}`} htmlFor={floatLabelProps.id}>{floatLabelProps.text}<span className={floatLabelProps.inputLabelSpanClassName}>{floatLabelProps.spanText}</span></label>
            )}
        </div>
    );
}


export const Calendar = (props) => {
    const {
        calendarParentClassName,
        calendarParentStyle,
        labelProps,
        calendarClassName,
        value,
        onChange,
        float,
        floatLabelProps,
        ...restProps
    } = props && props.calendarProps;

    const [date, setDate] = useState(props.calendarProps.date);

    const { localeJson } = useContext(LayoutContext);

    useEffect(() => {
        setDate(props.calendarProps.date)
    }, [props.calendarProps.date])

    addLocale('en', {
        firstDayOfWeek: 0,
        dayNames: [translate(localeJson, 'sunday'), translate(localeJson, 'monday'), translate(localeJson, 'tuesday'), translate(localeJson, 'wednesday'), translate(localeJson, 'thursday'), translate(localeJson, 'friday'), translate(localeJson, 'saturday')],
        dayNamesShort: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        dayNamesMin: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        monthNames: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'), translate(localeJson, 'aug'), translate(localeJson, 'sep'), translate(localeJson, 'oct'), translate(localeJson, 'nov'), translate(localeJson, 'dec')],
        monthNamesShort: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'), translate(localeJson, 'aug'), translate(localeJson, 'sep'), translate(localeJson, 'oct'), translate(localeJson, 'nov'), translate(localeJson, 'dec')],
        today: translate(localeJson, 'today'),
        clear: translate(localeJson, 'clear')
    });

    return (
        <div className={`custom_input ${calendarParentClassName} ${float ? 'p-float-label' : ''}`} style={calendarParentStyle}>
            {labelProps?.text && (
                <div className={`${labelProps.labelMainClassName || 'pb-1'}`}>
                    <NormalLabel
                        labelClass={labelProps.calendarLabelClassName}
                        text={labelProps.text}
                        spanText={labelProps.spanText}
                        spanClass={labelProps.calendarLabelSpanClassName}
                        htmlFor={labelProps.htmlFor}
                    />
                </div>
            )}
            <Cal className={`${calendarClassName}`}
                value={date || value}

                onChange={(e) => {
                    setDate(e.value);
                    if (onChange) {
                        onChange(e);
                    }
                }}
                dateFormat={translate(localeJson, 'dateFormat')}
                panelClassName="custom-panel"
                {...restProps}
            />
            {floatLabelProps?.text && (
                <label className={`custom-label ${floatLabelProps.calendarLabelClassName}`} htmlFor={floatLabelProps.id}>{floatLabelProps.text}<span className={floatLabelProps.calendarLabelSpanClassName}>{floatLabelProps.spanText}</span></label>
            )}
        </div>
    );
}


export const DateTimeDisplay = (props) => {
    const {
        fontsize,
        bgColor,
        fontWeight,
        parentClass,
        id,
        parentStyle,
    } = props;

    const { locale } = useContext(LayoutContext);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Update every minute

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const options = {
        year: 'numeric',
        month: locale=="ja"?'long':'2-digit',
        day: locale=="ja"?'numeric':'2-digit',
        hour: '2-digit',
        hour12:false,
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
    };
    
    const formattedDateTime = currentDateTime.toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US',options);
    const displayDateTime = formattedDateTime.replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, '$3-$1-$2 $4:$5');

    const formattedDateTime1 = currentDateTime.toLocaleString('ja-JP',options);
    const displayDateTime1 = formattedDateTime1.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ');

    return (
        <div className={`${fontsize} ${bgColor} ${fontWeight} ${parentClass}`} id={id} style={parentStyle}>
            { locale=="ja" ? displayDateTime1 : displayDateTime}
        </div>
    );
};