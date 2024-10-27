// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    //     const { name, email, message } = req.body;

    //     try {
    //       const contact = await prisma.contact.create({
    //         data: { name, email, message },
    //       });
    res.status(200).json(<>Hellow</>);
    //     } catch (error) {
    //       res.status(500).json({ error: "Error saving message" });
    //     }
    //   } else {
    //     res.status(405).json({ message: "Method not allowed" });
  }
}
