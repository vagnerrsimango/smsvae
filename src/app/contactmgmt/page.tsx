"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";

// Definir o tipo de contato
type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  sector: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Contact>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    sector: "Sem Setor",
  });
  const [customSector, setCustomSector] = useState<string>(""); // Novo campo para setor personalizado
  const [loading, setLoading] = useState(false); // Estado de carregamento para operações assíncronas
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Exibir mensagem de sucesso
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Exibir mensagem de erro

  const sectorOptions = ["Sem Setor", "Sales", "Marketing", "IT", "HR", "Finance", "VIP"];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      setLoading(true);
      setErrorMessage(null); // Clear the error message before starting the process
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: Papa.ParseResult<any>) => {
          const processedContacts: Contact[] = results.data.map((contact: any, index: number) => ({
            id: index + 1,
            name: `${contact["First Name"] || ""} ${contact["Middle Name"] || ""} ${contact["Last Name"] || ""}`.trim(),
            email: contact["E-mail 1 - Value"] || "",
            phone: contact["Phone 1 - Value"] || "",
            sector: contact["Sector"] || "Sem Setor",
          }));
  
          // Send the contacts to the API to save in the database
          try {
            const response = await fetch("/api/contact", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(processedContacts),
            });
  
            if (!response.ok) {
              throw new Error("Failed to upload contacts");
            }
  
            // If the response is successful
            setSuccessMessage("Contacts uploaded successfully");
          } catch (error) {
            // If there is an error
            setErrorMessage(error.message);
          } finally {
            setLoading(false);
          }
        },
      });
    }
  };

  // Buscar contatos quando o componente carregar
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        setErrorMessage("Erro ao buscar contatos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Verificar se o contato já existe pelo email ou telefone
  const contactExists = (contact: Contact) => {
    return contacts.some((c) => c.phone === contact.phone);
  };

  // Manipular o envio do formulário para adicionar um novo contato
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Verificar se o contato já existe
    if (contactExists(newContact)) {
      alert("Um contato com este email ou número de telefone já existe.");
      return;
    }

    setLoading(true);
    setErrorMessage(null); // Limpar qualquer erro anterior

    try {
      const contactToSave = {
        ...newContact,
        sector: customSector || newContact.sector, // Usar setor personalizado se fornecido
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contacts: [contactToSave] }),
      });

      if (response.ok) {
        setSuccessMessage("Adicionado com Sucesso!");
        const savedContact = await response.json();
        setContacts([...contacts, ...savedContact]); // Atualizar a lista de contatos
        // Limpar o formulário após a submissão bem-sucedida
        setNewContact({ id: 0, name: "", phone: "", email: "", sector: "Sem Setor" });
        setCustomSector(""); // Limpar o setor personalizado
        window.location.reload();
      } else {
        throw new Error("Falha ao salvar contato.");
      }
    } catch (error) {
      setErrorMessage("Erro ao salvar o contato. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manipular a mudança de entrada para um novo contato
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  // Manipular a mudança no setor personalizado
  const handleCustomSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSector(e.target.value);
  };

  // Manipular a exclusão de um contato
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        setSuccessMessage("Contato excluído com sucesso!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Erro ao excluir contato");
      }
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      setErrorMessage("Erro ao excluir contato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Contatos</h1>

      {/* Upload de Arquivo */}
      <div className="flex gap-4 mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="p-2 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Mensagens de sucesso e erro */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Formulário para Adicionar Contato */}
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={newContact.name}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefone"
          value={newContact.phone}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email (opcional)"
          value={newContact.email}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="sector"
          value={newContact.sector}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        >
          {sectorOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Setor Personalizado"
          value={customSector}
          onChange={handleCustomSectorChange}
          className="p-2 border border-gray-300 rounded"
        />
        <Button variant="outline" type="submit" className="col-span-full" disabled={loading}>
          {loading ? "Carregando..." : "Adicionar Contato"}
        </Button>
      </form>

      {/* Tabela de Contatos */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      <Badge variant={contact.sector === "VIP" ? "secondary" : "outline"}>{contact.sector}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" onClick={() => handleDelete(contact.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum contato encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}