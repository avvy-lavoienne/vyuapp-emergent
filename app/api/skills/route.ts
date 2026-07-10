import { NextRequest, NextResponse } from 'next/server';
import { getAllSkills, getSkillsByAgent, AGENT_PROFILES } from '@/lib/data/skills';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const agent = request.nextUrl.searchParams.get('agent');
    const skills = agent ? getSkillsByAgent(agent) : getAllSkills();

    // Group by category
    const grouped: Record<string, typeof skills> = {};
    for (const skill of skills) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    }

    return NextResponse.json({
      skills,
      grouped,
      total: skills.length,
      agents: AGENT_PROFILES,
    });
  } catch (err) {
    console.error('Skills API error:', err);
    return NextResponse.json({ error: 'Failed to load skills.' }, { status: 500 });
  }
}
