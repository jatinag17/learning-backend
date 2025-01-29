import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query", "erorr" ],

});

export default prisma