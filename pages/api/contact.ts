import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { contacts } = req.body;
    try {
      const createdContacts = await prisma.contact.createMany({
        data: contacts.map((contact) => ({
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          sector: contact.sector,
        })),
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
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
