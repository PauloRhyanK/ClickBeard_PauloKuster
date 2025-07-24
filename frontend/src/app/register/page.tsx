"use client";

import axios from "axios";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { ClientFormData } from "@/types/client";

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        type: '',
        date: '',
        appointments: [] as string[]
    });
    const [isBarber, setIsBarber] = useState(false);

    const updateField = (field: string, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAppointmentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        updateField('appointments', selectedOptions);
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!formData.name.trim()) {
                alert("Nome é obrigatório");
                return;
            }
            if (!formData.email.trim()) {
                alert("Email é obrigatório");
                return;
            }
            if (!formData.password.trim()) {
                alert("Senha é obrigatória");
                return;
            }
            if (!formData.type) {
                alert("Selecione o tipo de usuário");
                return;
            }
            const payload: ClientFormData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password.trim(),
                type: formData.type,
                appointments: formData.appointments
            };
            
            if (formData.date) {
                payload.date = new Date(formData.date).toISOString();
                payload.age = new Date().getFullYear() - new Date(formData.date).getFullYear();
            }
            const res = await axios.post("/api/register", payload)
            if (res.status >= 200 && res.status < 300) {
                if(res.data.success == true) {
                    alert("Cadastro realizado com sucesso!");
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        type: '',
                        date: '',
                        appointments: []
                    });
                }else {
                    if(res.data.error) {
                        alert(res.data.error);
                    }
                    alert("Erro ao cadastrar usuário, tente novamente mais tarde.");
                }
            } else {
                alert("Erro ao cadastrar usuário, tente novamente mais tarde.");
            }
        } catch (error: unknown) {
            alert("Erro ao cadastrar usuário, tente novamente mais tarde.");
            console.error("Registration failed:", error);
        }
    }

    function handleTypeChange(type: string) {
        updateField("type", type);
    }

    useEffect(() => {
        if(formData.type === "barber") {
            setIsBarber(true);
        }else {
            setIsBarber(false);
        }

    }, [formData.type]);

    return <>
        <header className="m-5 mt-10">
            <Image className="m-auto" src="/clickbeader_logo.webp" alt="Logo Clickbeard" width={150} height={38} />
        </header>
        <main className="flex justify-center">
            <form onSubmit={handleRegister} className="main-container window-color m-auto flex flex-col radius-lg p-10 rounded-xl gap-6 w-300">
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
                            <input value={formData.name} onChange={(e) => { updateField("name", e.target.value) }} type="text" name="name_usuas" id="name_usuas" placeholder="Insira seu nome completo" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="label" htmlFor="password_usuas">Senha</label>
                            <input value={formData.password} onChange={(e) => { updateField("password", e.target.value) }} type="password" name="password_usuas" id="password_usuas" placeholder="Insira sua Senha" required/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="label" htmlFor="email_usuas">Email</label>
                        <input value={formData.email} onChange={(e) => { updateField("email", e.target.value) }} type="email" name="email_usuas" id="email_usuas" placeholder="Insira seu Email" required/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <legend className="label">Tipo de Cadastro</legend>
                        <div className="grid grid-cols-2 gap-6">
                            <div onClick={() => handleTypeChange("barber")} className={`radioButton ${formData.type === "barber" ? "RBactive" : ""} flex items-center gap-2 justify-center`}>
                                <legend className="label">Barbeiro</legend>
                            </div>
                            <div onClick={() => handleTypeChange("client")} className={`radioButton ${formData.type === "client" ? "RBactive" : ""} flex items-center gap-2 justify-center`}>
                                <legend className="label">Cliente</legend>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="label title-md" htmlFor="date_usuas">Data de Nascimento</label>
                            <input onChange={(e) => { updateField("date", e.target.value) }} type="date" name="date_usuas" id="date_usuas" placeholder="Selecione sua Data de Nascimento" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="label" htmlFor="appointment_usuas">Especialidade</label>
                            <select disabled={!isBarber} multiple id="appointment_usuas" size={5} value={formData.appointments} onChange={handleAppointmentsChange} className="select">
                                <option value="Cabelo">Cabelo</option>
                                <option value="Barba">Barba</option>
                                <option value="Sobrancelha">Sobrancelha</option>
                                <option value="Implante">Implante</option>
                                <option value="Hidratação">Hidratação</option>
                            </select>
                            <p className="obs-color text-xs	">Segure <code>CTRL</code> para multipla escolha</p>
                            {
                                formData.appointments.length > 0 && (
                                    <p className="text-xs">Especialidades selecionadas: {formData.appointments.join(', ')}</p>
                                )
                            }
                        </div>
                    </div>

                </section>
                <div className="flex justify-between">
                    <button className="w-full text-sm" type="submit">Cadastrar</button>
                </div>
                <div className="p-sm">
                    Ja tem conta?<a className="text-sm link mx-2" href="/login">Logar</a>
                </div>
            </form>
        </main>

    </>
}
