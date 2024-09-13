"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { sendSingleMessage } from "ssms";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Example message templates
const modelosExemplo = [
  { id: 1, nome: "Mensagem de Boas-Vindas", conteudo: "Olá {nome}, bem-vindo ao nosso serviço!" },
  { id: 2, nome: "Atualização Semanal", conteudo: "Oi {nome}, aqui está a sua atualização semanal!" },
  { id: 3, nome: "Lembrete", conteudo: "Não te esqueças da nossa reunião em {data}." },
];

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  sector: string;
  selected?: boolean;
};

export default function Component() {
  const [modelos] = useState(modelosExemplo);
  const [modeloSelecionadoId, setModeloSelecionadoId] = useState("");
  const [conteudoMensagem, setConteudoMensagem] = useState("");
  const [agendar, setAgendar] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null); // Use Contact type
  const [contacts, setContacts] = useState<Contact[]>([]);


  // Fetch contacts when the component loads
  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("/api/contact");
      const data = await response.json();
      setContacts(data);
    };

    fetchContacts();
  }, []);


  const handleSelectTemplate = (id: number) => {
    const modelo = modelos.find((t) => t.id === id);
    setModeloSelecionadoId(id.toString());
    setConteudoMensagem(modelo ? modelo.conteudo : "");
  };

  const handleSendNow = async () => {
    // try {
    //   const response = await sendSingleMessage("5476b38fff208e0f77c358fad84078b179670ecf", phoneNumber, conteudoMensagem);
    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleScheduleMessage = () => {
    alert("Mensagem agendada!");
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-gray-50">
      <div className="flex flex-1 gap-6">
        <div className="flex-1 space-y-4">
          {/* Dropdown for selecting message template */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{modelos.find((modelo) => String(modelo.id) === modeloSelecionadoId)?.nome || "Selecionar Modelo"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Modelos de Mensagem</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {modelos.map((modelo) => (
                <DropdownMenuItem key={modelo.id} onClick={() => handleSelectTemplate(modelo.id)}>
                  {modelo.nome}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Message Textarea */}
          <Textarea
            placeholder="Componha sua mensagem aqui..."
            className="h-[300px] w-full resize-none border-gray-300 rounded-md"
            value={conteudoMensagem}
            onChange={(e) => setConteudoMensagem(e.target.value)}
          />

           {/* Send Now Button */}
           <Card>
            <CardHeader>
              <CardTitle>Enviar Agora</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/analytics">
                <Button className="w-full" onClick={handleSendNow}>
                  Enviar Mensagem
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Schedule Message */}
          <Card>
            <CardHeader>
              <CardTitle>Agendar Mensagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="datetime-local"
                placeholder="Selecionar data e hora"
                value={agendar}
                onChange={(e) => setAgendar(e.target.value)}
                className="border-gray-300 rounded-md"
              />
              <Button className="w-full" onClick={handleScheduleMessage}>
                Agendar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 w-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              {["Select", "Name", "Phone", "Email", "Sector"].map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length > 0 ? (
              Object.entries(
                contacts.reduce((acc, contact) => {
                  if (!acc[contact.sector]) acc[contact.sector] = [];
                  acc[contact.sector].push(contact);
                  return acc;
                }, {} as Record<string, Contact[]>)
              ).map(([sector, sectorContacts]) => (
                <React.Fragment key={sector}>
                  <TableRow>
                    <TableCell colSpan={5} className="bg-gray-200 font-bold">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSelectedContact(isChecked ? sectorContacts[0] : null);
                          setContacts((prevContacts) =>
                            prevContacts.map((contact) =>
                              contact.sector === sector ? { ...contact, selected: isChecked } : contact
                            )
                          );
                        }}
                      />
                      {sector}
                    </TableCell>
                  </TableRow>
                  {sectorContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={!!contact.selected}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setContacts((prevContacts) =>
                              prevContacts.map((c) =>
                                c.id === contact.id ? { ...c, selected: isChecked } : c
                              )
                            );
                          }}
                        />
                      </TableCell>
                      {["name", "phone", "email", "sector"].map((field) => (
                        <TableCell key={field}>
                          {field === "sector" ? (
                            <Badge variant={contact.sector === "VIP" ? "secondary" : "outline"}>
                              {contact.sector}
                            </Badge>
                          ) : (
                            contact[field as keyof Contact]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
          <Card>
       
      
      </Card>
        </div>
      </div>
    </div>
  );
}
