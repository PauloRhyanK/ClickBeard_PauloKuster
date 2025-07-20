import Image from "next/image";

export default function Login() {

    return <>
        <header className="m-5 mt-10">
            <Image className="m-auto" src="/clickbeader_logo.webp" alt="Logo Clickbeard" width={150} height={38} />
        </header>
        <main className="flex justify-center">
            <form action="" className="main-container window-color m-auto flex flex-col radius-lg p-10 rounded-xl gap-6">
                <section>
                    <h1 className="title-lg ">
                        Cadastro
                    </h1>
                    <p className="p-sm subt-color">Insira seus dados para cadastro!</p>
                </section>
                <section className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="label title-md" htmlFor="name_usuas">Nome Completo</label>
                            <input type="text" name="name_usuas" id="name_usuas" placeholder="Insira seu nome completo" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="label" htmlFor="password_usuas">Senha</label>
                            <input type="password" name="password_usuas" id="password_usuas" placeholder="Insira sua Senha" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="label" htmlFor="email_usuas">Email</label>
                        <input type="email" name="email_usuas" id="email_usuas" placeholder="Insira seu Email" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="label" htmlFor="type_usuas">Tipo de Cadastro</label>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="radioButton RBactive flex items-center gap-2 justify-center">
                                <input type="radio" name="type_usuas" id="barber" value="Barbeiro" />
                                <label htmlFor="barber" className="label">Barbeiro</label>
                            </div>
                            <div className="radioButton flex items-center gap-2 justify-center">
                                <input type="radio" name="type_usuas" id="client" value="Cliente" />
                                <label htmlFor="client" className="label">Cliente</label>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="label title-md" htmlFor="date_usuas">Data de Nascimento</label>
                            <input type="date" name="date_usuas" id="date_usuas" placeholder="Selecione sua Data de Nascimento" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="label" htmlFor="appointment_usuas">Especialidade</label>
                            <select multiple name="appointment_usuas[]" id="appointment_usuas" size={5}>
                                <option value="Cabelo">Cabelo</option>
                                <option value="Barba">Barba</option>
                                <option value="Implante">Implante</option>
                                <option value="Sobrancelha">Sobrancelha</option>
                                <option value="Outros">Outros</option>
                            </select>
                            <p className="obs-color text-xs	">Segure <code>CTRL</code> para multipla escolha</p> 
                        </div>
                    </div>

                </section>
                <div className="flex justify-between">
                    <button className="w-full text-sm" type="submit">Cadastrar</button>
                </div>
            </form>
        </main>

    </>
}
