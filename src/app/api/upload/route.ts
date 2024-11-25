import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    if (!formData.has('file')) {
      return NextResponse.json(
        { error: 'Ingen fil lastet opp' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'Ugyldig fil' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Kun bildefiler er tillatt' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure the filename is safe and unique
    const timestamp = new Date().getTime();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filePath = path.join(process.cwd(), 'public', 'logos', filename);
    
    await writeFile(filePath, buffer);
    
    // Return the absolute URL for the image
    return NextResponse.json({ 
      path: `/logos/${filename}`,
      success: true 
    });
  } catch (error) {
    console.error('Feil ved opplasting av fil:', error);
    return NextResponse.json(
      { error: 'Feil ved opplasting av fil' },
      { status: 500 }
    );
  }
}
