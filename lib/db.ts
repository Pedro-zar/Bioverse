import { PrismaClient } from "@prisma/client";

function gen_prisma() {
	return new PrismaClient();
}

export default gen_prisma;
