'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Search, ChevronDown, Package, Eye, X, Loader2, FileText,
  Folder, Terminal, BookOpen, PenTool, Rocket, Users,
  GraduationCap, Palette, Bug, MessageSquare, Book,
} from 'lucide-react';

/* ============ CATEGORY ICONS ============ */
const CATEGORY_ICONS = {
  'autonomous-ai-agents': <Rocket className="w-4 h-4" />,
  'computer-use': <Terminal className="w-4 h-4" />,
  'creative': <Palette className="w-4 h-4" />,
  'data-science': <Folder className="w-4 h-4" />,
  'email': <MessageSquare className="w-4 h-4" />,
  'github': <Book className="w-4 h-4" />,
  'media': <PenTool className="w-4 h-4" />,
  'mlops': <Terminal className="w-4 h-4" />,
  'note-taking': <BookOpen className="w-4 h-4" />,
  'productivity': <Folder className="w-4 h-4" />,
  'research': <Search className="w-4 h-4" />,
  'smart-home': <Rocket className="w-4 h-4" />,
  'social-media': <MessageSquare className="w-4 h-4" />,
  'software-development': <Terminal className="w-4 h-4" />,
  'yuanbao': <Users className="w-4 h-4" />,
  'orchestrator': <Rocket className="w-4 h-4" />,
  'content': <PenTool className="w-4 h-4" />,
  'dogfood': <Bug className="w-4 h-4" />,
  'training': <GraduationCap className="w-4 h-4" />,
};

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || <Package className="w-4 h-4" />;
}

/* ============ SIMPLE MARKDOWN -> HTML ============ */
function simpleMarkdownToHtml(md) {
  if (!md) return '<p class="text-[#737370] italic">No content available.</p>';
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

/* ============ SKILL DETAIL MODAL ============ */
function SkillDetailModal({ skill, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#333336] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-[#d2d2d7] dark:border-[#333336]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center text-[#2997ff] dark:text-[#5BA3FF]">
              {getCategoryIcon(skill.category)}
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {skill.name}
              </h2>
              <p className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b]">
                {skill.category}/{skill.slug}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2A2A2D] text-[#6e6e73] dark:text-[#86868b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="vyu-prose dark:vyu-prose text-sm" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(skill.content) }} />

          {skill.linkedFiles && skill.linkedFiles.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#d2d2d7] dark:border-[#333336]">
              <p className="vyu-overline mb-3">// LINKED FILES</p>
              <div className="space-y-1.5">
                {skill.linkedFiles.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs font-mono text-[#6e6e73] dark:text-[#86868b]">
                    <FileText className="w-3 h-3" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#d2d2d7] dark:border-[#333336] flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {skill.tags && skill.tags.slice(0, 6).map((tag) => (
              <span key={tag} className="vyu-chip text-[10px]">#{tag}</span>
            ))}
          </div>
          {skill.version && (
            <span className="text-[10px] font-mono text-[#86868b]">v{skill.version}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ SKILL CARD ============ */
function SkillCard({ skill, onView }) {
  return (
    <div className="vyu-card p-5 flex flex-col gap-3 group">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#2997ff]/10 dark:bg-[#5BA3FF]/10 flex items-center justify-center text-[#2997ff] dark:text-[#5BA3FF] flex-shrink-0">
          {getCategoryIcon(skill.category)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
            {skill.name}
          </h3>
          <p className="text-[10px] font-mono text-[#86868b] dark:text-[#545458] mt-0.5">
            {skill.category}/{skill.slug}
          </p>
        </div>
      </div>

      {skill.description && (
        <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed line-clamp-2">
          {skill.description}
        </p>
      )}

      <div className="flex items-center gap-2">
        <span className="vyu-chip text-[10px]">{skill.category}</span>
        {skill.profile && (
          <span className="text-[10px] font-mono text-[#2997ff] dark:text-[#5BA3FF]">@{skill.profile}</span>
        )}
      </div>

      {skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[9px] font-mono text-[#86868b] dark:text-[#545458] uppercase">#{tag}</span>
          ))}
          {skill.tags.length > 4 && (
            <span className="text-[9px] font-mono text-[#86868b]">+{skill.tags.length - 4}</span>
          )}
        </div>
      )}

      <button
        onClick={onView}
        className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#d2d2d7] dark:border-[#333336] text-xs font-medium text-[#6e6e73] dark:text-[#86868b] hover:text-[#2997ff] dark:hover:text-[#5BA3FF] hover:border-[#2997ff]/30 dark:hover:border-[#5BA3FF]/30 transition-all"
      >
        <Eye className="w-3.5 h-3.5" /> View Details
      </button>
    </div>
  );
}

/* ============ MAIN CLIENT COMPONENT ============ */
export default function SkillsClient() {
  const [skills, setSkills] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailSkill, setDetailSkill] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchSkills = useCallback(async (agent) => {
    setLoading(true);
    try {
      const url = agent && agent !== 'all' ? `/api/skills?agent=${agent}` : '/api/skills';
      const res = await fetch(url);
      const data = await res.json();
      setSkills(data.skills || []);
      if (data.agents) setAgents(data.agents);
    } catch {
      setSkills([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills(selectedAgent);
  }, [selectedAgent, fetchSkills]);

  const handleViewDetail = async (skill) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/skills/${skill.slug}`);
      if (res.ok) {
        const data = await res.json();
        setDetailSkill(data);
      }
    } catch {
      // ignore
    }
    setDetailLoading(false);
  };

  const filtered = skills.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const agentLabel = selectedAgent === 'all' ? 'All Agents' : `@${selectedAgent}`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="vyu-overline">// MANAGEMENT</p>
          <h1 className="mt-3 text-3xl font-sans font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Skill Management
          </h1>
          <p className="mt-2 text-sm text-[#6e6e73] dark:text-[#86868b]">
            View and manage agent skills across all profiles.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Agent Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-56 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] hover:border-[#86868b] transition-colors"
            >
              <span className="font-mono text-xs">{agentLabel}</span>
              <ChevronDown className={`w-4 h-4 text-[#6e6e73] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute z-50 mt-2 w-full sm:w-56 max-h-72 overflow-y-auto bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] rounded-xl shadow-xl">
                  <button
                    onClick={() => { setSelectedAgent('all'); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-mono transition-colors ${selectedAgent === 'all' ? 'bg-[#2997ff]/10 text-[#2997ff]' : 'text-[#6e6e73] dark:text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2A2A2D]'}`}
                  >
                    All Agents
                  </button>
                  {agents.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setSelectedAgent(a); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-mono transition-colors ${selectedAgent === a ? 'bg-[#2997ff]/10 text-[#2997ff]' : 'text-[#6e6e73] dark:text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2A2A2D]'}`}
                    >
                      @{a}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center">
            <span className="text-xs font-mono text-[#86868b] dark:text-[#545458] whitespace-nowrap">
              {loading ? '...' : `${filtered.length} skills`}
            </span>
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#2997ff]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-12 h-12 text-[#d2d2d7] dark:border-[#333336] mb-4" />
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b]">No skills found.</p>
            <p className="text-xs text-[#86868b] dark:text-[#545458] mt-1">Try a different agent or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill) => (
              <SkillCard
                key={`${skill.category}-${skill.slug}`}
                skill={skill}
                onView={() => handleViewDetail(skill)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <Loader2 className="w-8 h-8 animate-spin text-[#2997ff] relative z-10" />
        </div>
      )}
      {detailSkill && (
        <SkillDetailModal skill={detailSkill} onClose={() => setDetailSkill(null)} />
      )}
    </div>
  );
}
