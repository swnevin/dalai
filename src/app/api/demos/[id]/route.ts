import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.demo.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Feil ved sletting av demo' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const demo = await prisma.demo.findUnique({
      where: { id: params.id },
    });
    
    if (!demo) {
      return NextResponse.json(
        { error: 'Demo ikke funnet' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(demo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Feil ved henting av demo' },
      { status: 500 }
    );
  }
}
