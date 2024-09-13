"use client";

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  sector: string;
};

type Sector = {
  id: number;
  name: string;
  count: number;
};

export default function Contactos() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredSector, setFilteredSector] = useState<string>("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [newSectorName, setNewSectorName] = useState<string>("");

  useEffect(() => {
    // Update sector counts whenever contacts change
    const sectorCounts = contacts.reduce((acc: Record<string, number>, contact) => {
      const sector = contact.sector || "Sem Setor";
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {});

    const sectorList = Object.entries(sectorCounts).map(([name, count], index) => ({
      id: index + 1,
      name,
      count
    }));

    setSectors([
      { id: 0, name: "Todos", count: contacts.length }, // Card to show all contacts
      ...sectorList
    ]);
  }, [contacts]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          const processedContacts: Contact[] = results.data.map((contact: any, index: number) => ({
            id: index + 1,
            name: `${contact["First Name"] || ""} ${contact["Middle Name"] || ""} ${contact["Last Name"] || ""}`.trim(),
            email: contact["E-mail 1 - Value"] || "",
            phone: contact["Phone 1 - Value"] || "",
            sector: contact["Sector"] || "Sem Setor",
          }));

          setContacts(processedContacts);
        },
      });
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(contacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_contacts.csv");
  };

  const handleSectorClick = (sector: string) => {
    setFilteredSector(sector === "Todos" ? "" : sector);
  };

  const handleAddSector = () => {
    if (newSectorName.trim()) {
      setSectors(prevSectors => {
        const sectorExists = prevSectors.some(sector => sector.name === newSectorName);
        if (!sectorExists) {
          return [
            ...prevSectors,
            {
              id: prevSectors.length + 1,
              name: newSectorName,
              count: 0
            }
          ];
        }
        return prevSectors;
      });
      setNewSectorName("");
    }
  };

  const filteredContacts = filteredSector
    ? contacts.filter((contact) => contact.sector.toLowerCase() === filteredSector.toLowerCase() || (filteredSector === "Sem Setor" && contact.sector === "Sem Setor"))
    : contacts;

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground">
      <main className="flex-1 grid grid-cols-[1fr_2fr] gap-6 p-6">
        <section className="flex flex-col items-center justify-center gap-4">
          <div className="mb-4 flex items-center justify-between w-full max-w-4xl">
            <div className="flex gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="p-2 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Sectores de Contactos</h2>
            <div className="flex gap-4">
             
              <input
                type="text"
                placeholder="Novo setor..."
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <Button variant="outline" onClick={handleAddSector}>Adicionar</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sectors.map((sector) => (
              <Card
                key={sector.id}
                className="flex flex-col items-center justify-center gap-2 p-4 cursor-pointer"
                onClick={() => handleSectorClick(sector.name)}
              >
                <div className="text-4xl font-bold">{sector.count}</div>
                <p className="text-muted-foreground">{sector.name}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Detalhes de Contactos</h2>
            <Button variant="outline" onClick={handleExport}>Exportar para CSV</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      <Badge variant={contact.sector === "VIP" ? "secondary" : "outline"}>
                        {contact.sector}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </main>
    </div>
  );
}
