export default function ListAppointment({ role }: { role: string }) {
    if (role === "client") {
        return (
        <div>
            <section className="pr-10 pl-20">
                <div className="flex flex-col items-start pt-20 pb-10">
                    <h2 className="title-lg">Seus agendamentos</h2>
                    <p className="p-sm subt-color">Aqui você pode visualizar seus horários marcados.</p>
                </div>
                <ul>
                    <li className="itemAppointmentClient flex flex-col mb-5">
                        <div className="itemHeader flex justify-between items-center p-md p-5">
                            <strong>20 de setembro</strong>
                            <span>08h-08h30</span>
                        </div>
                        <div className="itemData p-md pt-10 pb-10 pl-7 pr-7">
                            <strong>15:00</strong>
                            <span className="">Dr. Silva</span>
                            <span>Cabelo</span>
                            <strong className="flex justify-end">X</strong>
                        </div>
                    </li>
                </ul>
            </section>
            <section className="pr-10 pl-20">
                <div className="flex flex-col items-start pt-5 pb-10">
                    <h2 className="title-lg">Seus agendamentos</h2>
                    <p className="p-sm subt-color">Aqui você pode visualizar seus horários marcados.</p>
                </div>
                <ul>
                    <li className="itemHistoricClient flex flex-col mb-5">
                        <div className="itemHeader flex justify-between items-center p-md p-5">
                            <strong>20 de setembro</strong>
                            <span>08h-08h30</span>
                        </div>
                        <div className="itemData p-md pt-10 pb-10 pl-7 pr-7">
                            <strong>15:00</strong>
                            <span className="">Dr. Silva</span>
                            <span>Cabelo</span>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
        );
    }
}