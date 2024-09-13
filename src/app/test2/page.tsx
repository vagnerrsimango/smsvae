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
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]); // Filtered contacts
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleContacts, setVisibleContacts] = useState<Record<string, number>>({});

  // Fetch contacts when the component loads
  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("/api/contact");
      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data); // Initialize filtered contacts with all contacts
    };

    fetchContacts();
  }, []);

  // Show more contacts for a sector
const showMoreContacts = (sector: string) => {
    setVisibleContacts((prevVisibleContacts) => ({
      ...prevVisibleContacts,
      [sector]: prevVisibleContacts[sector] + 10 || 10,
    }));
  };

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

  const handleFilterContacts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.sector.toLowerCase().includes(searchTerm)
    );

    setFilteredContacts(filtered);
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

        {/* Contacts List and Search Filter */}
        <div className="space-y-6 w-[400px]">
          {/* Search Filter for Contacts */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Filtrar Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Digite o nome, setor ou email..."
                className="mb-4 border-gray-300 rounded-md"
                value={searchTerm}
                onChange={handleFilterContacts}
              />
            </CardContent>
          </Card>

          {/* Contacts Table */}
          <Table className="w-full border-separate border-spacing-y-2">
      <TableHeader className="bg-blue-100">
        <TableRow>
          {["Select", "Name", "Phone", "Email", "Sector"].map((header) => (
            <TableHead key={header} className="text-left p-2 font-semibold">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredContacts.length > 0 ? (
          Object.entries(
            filteredContacts.reduce((acc, contact) => {
              if (!acc[contact.sector]) acc[contact.sector] = [];
              acc[contact.sector].push(contact);
              return acc;
            }, {} as Record<string, Contact[]>)
          ).map(([sector, sectorContacts]) => {
            const visibleCount = visibleContacts[sector] || 10; // Show first 10 by default
            const totalContacts = sectorContacts.length;

            return (
              <React.Fragment key={sector}>
                {/* Sector Heading Row with Count */}
                <TableRow className="bg-gray-100">
                  <TableCell colSpan={5} className="p-3 font-bold">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFilteredContacts((prevContacts) =>
                            prevContacts.map((contact) =>
                              contact.sector === sector ? { ...contact, selected: isChecked } : contact
                            )
                          );
                        }}
                        className="mr-2"
                      />
                      <span>{sector} ({totalContacts})</span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Display only the first 10 contacts, or more if 'show more' is clicked */}
                {sectorContacts.slice(0, visibleCount).map((contact) => (
                  <TableRow key={contact.id} className="border-b hover:bg-gray-50">
                    <TableCell className="p-2">
                      <input
                        type="checkbox"
                        checked={!!contact.selected}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFilteredContacts((prevContacts) =>
                            prevContacts.map((c) =>
                              c.id === contact.id ? { ...c, selected: isChecked } : c
                            )
                          );
                        }}
                      />
                    </TableCell>
                    {["name", "phone", "email", "sector"].map((field) => (
                      <TableCell key={field} className="p-2">
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

                {/* Show more button if there are more than 10 contacts */}
                {totalContacts > visibleCount && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-3">
                      <button
                        onClick={() => showMoreContacts(sector)}
                        className="text-blue-500 underline"
                      >
                        Show more ({totalContacts - visibleCount} remaining)
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center p-5 text-gray-500">
              No contacts found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

        </div>
      </div>
    </div>
  );
}
