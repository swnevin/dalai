import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

interface Demo {
  id: string;
  clientName: string;
  projectId: string;
  environment: string;
  brandColor: string;
  backgroundPath: string;
  backgroundType?: 'screenshot' | 'raining-logo';
}

const DEMOS_FILE = path.join(process.cwd(), 'data', 'demos.json');

// Helper function to read demos from file
async function readDemos(): Promise<Demo[]> {
  try {
    const data = await readFile(DEMOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write demos to file
async function writeDemos(demos: Demo[]): Promise<void> {
  await writeFile(DEMOS_FILE, JSON.stringify(demos, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientName = searchParams.get('clientName');
  
  try {
    const demos = await readDemos();
    
    if (clientName) {
      const filteredDemos = demos.filter(
        demo => demo.clientName.toLowerCase() === clientName.toLowerCase()
      );
      return NextResponse.json(filteredDemos);
    }
    
    return NextResponse.json(demos);
  } catch (error) {
    console.error('Error reading demos:', error);
    return NextResponse.json({ error: 'Failed to read demos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const demos = await readDemos();
    
    const newDemo = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: body.clientName,
      projectId: body.projectId,
      environment: body.environment,
      brandColor: body.brandColor,
      backgroundPath: body.backgroundPath || '',
      backgroundType: body.backgroundType,
    };

    demos.push(newDemo);
    await writeDemos(demos);
    
    return NextResponse.json(newDemo);
  } catch (error) {
    console.error('Error creating demo:', error);
    return NextResponse.json(
      { error: 'Failed to create demo' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Demo ID er påkrevd' },
        { status: 400 }
      );
    }

    const demos = await readDemos();
    const index = demos.findIndex(demo => demo.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Demo ikke funnet' },
        { status: 404 }
      );
    }

    demos[index] = {
      ...demos[index],
      ...body,
      id, // Preserve the original ID
    };

    await writeDemos(demos);
    return NextResponse.json(demos[index]);
  } catch (error) {
    console.error('Feil ved oppdatering av demo:', error);
    return NextResponse.json(
      { error: 'Kunne ikke oppdatere demo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Demo ID er påkrevd' },
        { status: 400 }
      );
    }

    const demos = await readDemos();
    const filteredDemos = demos.filter(demo => demo.id !== id);
    
    if (demos.length === filteredDemos.length) {
      return NextResponse.json(
        { error: 'Demo ikke funnet' },
        { status: 404 }
      );
    }

    await writeDemos(filteredDemos);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feil ved sletting av demo:', error);
    return NextResponse.json(
      { error: 'Kunne ikke slette demo' },
      { status: 500 }
    );
  }
}
