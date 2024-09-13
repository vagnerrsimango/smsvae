"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define the contact type
type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
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

  // Fetch contacts when the component loads
  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("/api/contact");
      const data = await response.json();
      setContacts(data);
    };

    fetchContacts();
  }, []);

  // Check if contact already exists by email or phone
  const contactExists = (contact: Contact) => {
    return contacts.some(
      (c) => c.email === contact.email || c.phone === contact.phone
    );
  };

  // Handle form submission to add a new contact
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if the contact already exists
    if (contactExists(newContact)) {
      alert("A contact with this email or phone number already exists.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contacts: [newContact] }),
      });

      if (response.ok) {
        const savedContact = await response.json();
        setContacts([...contacts, ...savedContact]); // Update the contacts list
        // Reset the form after successful submission
        setNewContact({ id: 0, name: "", phone: "", email: "", sector: "Sem Setor" });
      } else {
        console.error("Failed to save contact");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle input change for new contact
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Contacts</h1>

      {/* Add Contact Form */}
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newContact.name}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={newContact.phone}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newContact.email}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="sector"
          placeholder="Sector"
          value={newContact.sector}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <Button variant="outline" type="submit" className="col-span-full">
          Add Contact
        </Button>
      </form>

      {/* Contacts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sector</TableHead>
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
                    <Badge variant={contact.sector === "VIP" ? "secondary" : "outline"}>
                      {contact.sector}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
