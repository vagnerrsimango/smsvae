"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from 'xlsx';

interface Contact {
  Name: string;
  Email: string;
  Phone: string;
  Status?: string;
}

export default function HelloWorld() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Handle file upload and filtering by Status
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          const filteredContacts: Contact[] = results.data.map((contact: any) => {
            return {
              Name: `${contact["First Name"] || ""} ${contact["Middle Name"] || ""} ${contact["Last Name"] || ""}`.trim(),
              Email: contact["E-mail 1 - Value"] || "",
              Phone: contact["Phone 1 - Value"] || "",
              Status: contact["Status"] || "Unknown", // Assuming Status as a contact field
            };
          });

          setContacts(filteredContacts);
        },
      });
    }
  };

  // Export contacts as CSV
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(contacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_contacts.csv");
  };

  // Filter contacts by status
  const filteredContacts = filterStatus
    ? contacts.filter((contact) => contact.Status?.toLowerCase().includes(filterStatus.toLowerCase()))
    : contacts;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-500 mb-6">Hello, World!</h1>

      
    </div>
  );
}
