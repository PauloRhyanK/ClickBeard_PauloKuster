type HoursAppointment = {
    hour: string;
    selected: boolean;
};

export default function HoursApointment({ hours, setHours }: { hours: HoursAppointment[], setHours: React.Dispatch<React.SetStateAction<HoursAppointment[]>> }) {

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

    return (
        <ul className="grid grid-cols-4 gap-2">
    {hours.map((hour, index) => {
        const currentPeriod = sPeriod(hour.hour, period);
        return (
            <>
                {currentPeriod.isTitle && (
                    <li key={`header-${index}`} className={`hour-period ${currentPeriod.class}`}>
                        {currentPeriod.name}
                    </li>
                )}
                <li key={index} className="hour hour-available flex items-center gap-2" onClick={() => {}}>
                    {hour.hour}
                </li>
            </>
        );
    })}
        </ul>
    );
}