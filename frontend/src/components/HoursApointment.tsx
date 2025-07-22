import { Fragment } from "react";
import {HourSlot} from "@/lib/appoitmentService";

type HoursApointmentProps = {
    hours: HourSlot[];
    setHour: (hour: string) => void;
    selectedHour: string;
};

export default function HoursApointment({ hours, setHour, selectedHour }: HoursApointmentProps) {
    const period = { class: "", name: "", isTitle: false };
    
    function sPeriod(hour: string, period: { class: string; name: string; isTitle: boolean }) {
        let h = parseInt(hour.split(":")[0]);
        let tempClass = "";
        let tempName = "";
        
        if (h < 13) {
            tempClass = "morning";
            tempName = "Manhã";
        } else if (h <= 18) {
            tempClass = "afternoon";
            tempName = "Tarde";
        } else {
            tempClass = "night";
            tempName = "Noite";
        }
        
        if (tempClass != period.class) {
            period.class = tempClass;
            period.name = tempName;
            period.isTitle = true;
        } else {
            period.isTitle = false;
        }
        return period;
    }

    const getHourClass = (hour: HourSlot) => {
        const isSelected = selectedHour === hour.hour;
        const isAvailable = !hour.selected; 
        
        if (isSelected) {
            return "hour hour-selected"; 
        } else if (isAvailable) {
            return "hour hour-available"; 
        } else {
            return "hour hour-unavailable"; 
        }
    };

    const handleHourClick = (hour: HourSlot) => {
        if (!hour.selected) {
            if (selectedHour === hour.hour) {
                setHour(""); 
            } else {
                setHour(hour.hour);
            }
        }
    };

    return (
        <>
            <label className="label">Horários Disponíveis</label>
            <ul className="grid grid-cols-4 gap-2">
                {hours.map((hour, index) => {
                    const currentPeriod = sPeriod(hour.hour, period);
                    return (
                        <Fragment key={`fragment-${index}`}>
                            {currentPeriod.isTitle && (
                                <li 
                                    key={`header-${index}`} 
                                    className={`hour-period ${currentPeriod.class} col-span-4 py-2 font-semibold`}
                                >
                                    {currentPeriod.name}
                                </li>
                            )}
                            <li 
                                key={`hour-${index}`}
                                className={`${getHourClass(hour)} flex items-center justify-center gap-2 p-2 rounded cursor-pointer transition-all`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHourClick(hour);
                                }}
                            >
                                {hour.hour}
                            </li>
                        </Fragment>
                    );
                })}
            </ul>
        
        </>
    );
}