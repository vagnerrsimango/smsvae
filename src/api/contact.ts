import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { contacts } = req.body;

    try {
      // Validate that each contact has phone, id, and set sector to default "Sem Setor" if missing
      const validatedContacts = contacts.map((contact) => ({
        id: contact.id,
        phone: contact.phone,  // Ensure phone is obligatory
        name: contact.name || "", // Name can be empty
        email: contact.email || "", // Email can be empty
        sector: contact.sector || "Sem Setor", // Default to "Sem Setor" if missing
      }));

      // Check if phone is missing in any of the contacts
      const contactsWithoutPhone = validatedContacts.filter(contact => !contact.phone);
      if (contactsWithoutPhone.length > 0) {
        return res.status(400).json({ error: "Phone number is required for all contacts" });
      }

      // Use Prisma's createMany to save contacts in the database
      const createdContacts = await prisma.contact.createMany({
        data: validatedContacts,
        skipDuplicates: true, // Prevent duplicate phone entries
      });

      res.status(200).json(createdContacts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error saving contacts" });
    }
  } else if (req.method === "GET") {
    try {
      const contacts = await prisma.contact.findMany();
      res.status(200).json(contacts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching contacts" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    try {
      const deletedContact = await prisma.contact.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(deletedContact);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting contact" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}