import { NextResponse } from 'next/server';

// In-memory storage for demos
let demos: Array<{
  id: string;
  clientName: string;
  projectId: string;
  environment: string;
  brandColor: string;
  backgroundPath: string;
}> = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientName = searchParams.get('clientName');

  if (clientName) {
    const filteredDemos = demos.filter(
      demo => demo.clientName.toLowerCase() === clientName.toLowerCase()
    );
    return NextResponse.json(filteredDemos);
  }

  return NextResponse.json(demos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.backgroundPath) {
      return NextResponse.json(
        { error: 'Background image is required' },
        { status: 400 }
      );
    }

    const newDemo = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: body.clientName,
      projectId: body.projectId,
      environment: body.environment,
      brandColor: body.brandColor,
      backgroundPath: body.backgroundPath,
    };

    demos.push(newDemo);
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
    const body = await request.json();
    const index = demos.findIndex(demo => demo.id === body.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Demo not found' },
        { status: 404 }
      );
    }

    demos[index] = {
      ...demos[index],
      clientName: body.clientName,
      projectId: body.projectId,
      environment: body.environment,
      brandColor: body.brandColor,
      backgroundPath: body.backgroundPath || demos[index].backgroundPath,
    };

    return NextResponse.json(demos[index]);
  } catch (error) {
    console.error('Error updating demo:', error);
    return NextResponse.json(
      { error: 'Failed to update demo' },
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
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const initialLength = demos.length;
    demos = demos.filter(demo => demo.id !== id);

    if (demos.length === initialLength) {
      return NextResponse.json(
        { error: 'Demo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting demo:', error);
    return NextResponse.json(
      { error: 'Failed to delete demo' },
      { status: 500 }
    );
  }
}
