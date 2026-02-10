import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Project from '../../../models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({});
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (Array.isArray(body)) {
      for (const project of body) {
        await Project.findOneAndUpdate(
          { id: project.id },
          project,
          { upsert: true, new: true }
        );
      }
      return NextResponse.json({ message: 'Projects migrated successfully' });
    } else {
      const project = await Project.findOneAndUpdate(
        { id: body.id },
        body,
        { upsert: true, new: true }
      );
      return NextResponse.json(project);
    }
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Project.findOneAndDelete({ id });
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
