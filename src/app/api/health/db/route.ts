import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection with a simple query
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    
    return Response.json({
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return Response.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

