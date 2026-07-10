import fs from 'fs';
import path from 'path';
import os from 'os';

export interface SkillMeta {
  name: string;
  slug: string;
  category: string;
  description: string;
  version?: string;
  tags: string[];
  profile?: string;
  filePath: string;
  linkedFiles: string[];
}

// All known agent profiles
export const AGENT_PROFILES = [
  'hikari', 'project-manager', 'dev', 'frontend-dev', 'backend-dev',
  'qa', 'qa-code', 'scout', 'scribe', 'ui-ux', 'devops', 'reach',
  'lotus', 'guru', 'training-camp',
];

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result: Record<string, unknown> = {};
  let currentKey = '';
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') && inArray) {
      arrayValues.push(trimmed.slice(2).replace(/^["']|["']$/g, ''));
      continue;
    }
    if (inArray && currentKey) {
      result[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    if (value === '' || value === '[') {
      // Could be a nested object or array
      if (value === '[') {
        // Inline array
        value = trimmed.slice(colonIdx + 1).trim();
        const arrMatch = value.match(/^\[(.*)\]$/);
        if (arrMatch) {
          result[key] = arrMatch[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        }
      } else {
        currentKey = key;
        inArray = true;
        arrayValues = [];
      }
      continue;
    }

    // Inline array
    const arrMatch = value.match(/^\[(.*)\]$/);
    if (arrMatch) {
      result[key] = arrMatch[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    } else {
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  if (inArray && currentKey) {
    result[currentKey] = arrayValues;
  }
  return result;
}

function getLinkedFiles(skillDir: string): string[] {
  const linked: string[] = [];
  const subdirs = ['references', 'templates', 'scripts', 'assets'];
  for (const subdir of subdirs) {
    const dirPath = path.join(skillDir, subdir);
    if (fs.existsSync(dirPath)) {
      const walk = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(fullPath);
          } else {
            linked.push(path.relative(skillDir, fullPath));
          }
        }
      };
      walk(dirPath);
    }
  }
  return linked;
}

function scanSkillsDir(skillsBase: string): SkillMeta[] {
  const skills: SkillMeta[] = [];
  if (!fs.existsSync(skillsBase)) return skills;

  // Structure: <category>/<skill-name>/SKILL.md
  const categories = fs.readdirSync(skillsBase, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'));

  for (const cat of categories) {
    const catPath = path.join(skillsBase, cat.name);
    const skillDirs = fs.readdirSync(catPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'));

    for (const skillDir of skillDirs) {
      const skillMdPath = path.join(catPath, skillDir.name, 'SKILL.md');
      if (!fs.existsSync(skillMdPath)) continue;

      try {
        const content = fs.readFileSync(skillMdPath, 'utf-8');
        const fm = parseFrontmatter(content);
        const meta = fm.metadata as Record<string, unknown> | undefined;
        const hermes = meta?.hermes as Record<string, unknown> | undefined;

        skills.push({
          name: (fm.name as string) || skillDir.name,
          slug: skillDir.name,
          category: cat.name,
          description: (fm.description as string) || '',
          version: (fm.version as string) || undefined,
          tags: (hermes?.tags as string[]) || [],
          filePath: skillMdPath,
          linkedFiles: getLinkedFiles(path.join(catPath, skillDir.name)),
        });
      } catch {
        // Skip unreadable SKILL.md
      }
    }
  }
  return skills;
}

export function getAllSkills(): SkillMeta[] {
  const homeDir = os.homedir();
  const allSkills: SkillMeta[] = [];

  // 1. Global skills: ~/.hermes/skills/
  const globalSkills = path.join(homeDir, '.hermes', 'skills');
  allSkills.push(...scanSkillsDir(globalSkills));

  // 2. Per-profile skills: ~/.hermes/profiles/<profile>/skills/
  for (const profile of AGENT_PROFILES) {
    const profileSkills = path.join(homeDir, '.hermes', 'profiles', profile, 'skills');
    const profileSkillList = scanSkillsDir(profileSkills);
    // Tag each with the profile name
    for (const s of profileSkillList) {
      s.profile = profile;
      // Avoid duplicates (same skill in multiple profiles)
      if (!allSkills.some(existing => existing.slug === s.slug && existing.category === s.category)) {
        allSkills.push(s);
      }
    }
  }

  return allSkills;
}

export function getSkillsByAgent(agent: string): SkillMeta[] {
  const all = getAllSkills();
  if (!agent || agent === 'all') return all;
  return all.filter(s => s.profile === agent);
}

export function getSkillDetail(name: string): SkillMeta | null {
  const all = getAllSkills();
  return all.find(s => s.slug === name || s.name === name) || null;
}

export function getSkillContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

export function getLinkedFileContent(skillDir: string, relativePath: string): string {
  const fullPath = path.join(skillDir, relativePath);
  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return '';
  }
}
