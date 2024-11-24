import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Ingen fil lastet opp' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure the filename is safe
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(process.cwd(), 'public', 'logos', safeFileName);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      path: `/logos/${safeFileName}`,
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
