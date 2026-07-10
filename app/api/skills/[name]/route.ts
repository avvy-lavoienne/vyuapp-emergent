import { NextRequest, NextResponse } from 'next/server';
import { getSkillDetail, getSkillContent } from '@/lib/data/skills';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const skill = getSkillDetail(name);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }

    const content = getSkillContent(skill.filePath);
    // Get content without frontmatter
    const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    const body = bodyMatch ? bodyMatch[1].trim() : content;

    return NextResponse.json({
      ...skill,
      content: body,
      skillDir: path.dirname(skill.filePath),
    });
  } catch (err) {
    console.error('Skill detail API error:', err);
    return NextResponse.json({ error: 'Failed to load skill.' }, { status: 500 });
  }
}
