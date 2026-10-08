import React from 'react';
import {
  LayoutGrid,
  ScanEye,
  TrendingUp,
  MessageSquareCode,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export type ActiveView = 'matrix' | 'scanner' | 'market' | 'copilot' | 'benchmarks';

interface NavigationRailProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadCopilotCount?: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  unreadCopilotCount = 0,
}) => {
  const navItems = [
    {
      id: 'matrix' as ActiveView,
      label: 'Talent Matrix',
      description: 'Skill gap evaluation & signals',
      icon: LayoutGrid,
    },
    {
      id: 'scanner' as ActiveView,
      label: 'Artifact Scanner',
      description: 'Multimodal resume & system analysis',
      icon: ScanEye,
      badge: 'Gemini Pro',
    },
    {
      id: 'market' as ActiveView,
      label: 'Market Grounding',
      description: 'Live Search market compensation',
      icon: TrendingUp,
      badge: 'Live Data',
    },
    {
      id: 'copilot' as ActiveView,
      label: 'Syntropic Copilot',
      description: 'Multi-turn talent evaluation AI',
      icon: MessageSquareCode,
      count: unreadCopilotCount,
    },
    {
      id: 'benchmarks' as ActiveView,
      label: 'Role Archetypes',
      description: 'Multi-step calibration stepper',
      icon: Layers,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#FAFAFC] border-r border-[#E2E8F0] transition-all duration-200 select-none z-30 shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#E2E8F0] justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-sm shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-[14px] font-semibold tracking-tight text-[#0B132B] flex items-center gap-1.5">
                SYNTROPIC
                <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded tracking-normal">
                  v2.6
                </span>
              </span>
              <span className="text-[11px] text-[#64748B] font-medium tracking-wide uppercase">
                Talent Intelligence
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#64748B] hover:text-[#0B132B] hover:bg-[#F1F3F9] transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-2 mb-2">
          {!collapsed ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Intelligence Platform
            </span>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center rounded-lg transition-all text-left group relative ${
                collapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'
              } ${
                isActive
                  ? 'bg-white text-[#4F46E5] font-semibold shadow-[0_1px_3px_0_rgba(11,19,43,0.06)] border border-[#E0E7FF]'
                  : 'text-[#334155] hover:bg-[#F1F3F9] hover:text-[#0B132B] border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`flex items-center justify-center rounded-md shrink-0 ${
                  isActive ? 'text-[#4F46E5]' : 'text-[#64748B] group-hover:text-[#0B132B]'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] leading-tight truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.5 rounded-full border border-[#C7D2FE]">
                        {item.badge}
                      </span>
                    )}
                    {item.count ? (
                      <span className="w-4 h-4 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">
                        {item.count}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[11px] text-[#64748B] block truncate mt-0.5">
                    {item.description}
                  </span>
                </div>
              )}

              {/* Collapsed Tooltip Indicator */}
              {collapsed && isActive && (
                <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Footnote */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#FAFAFC]">
        {!collapsed ? (
          <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-medium text-[#0B132B]">Syntropic Model Matrix</span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1 leading-snug">
              Gemini 3.1 Pro & 3.5 Flash connected for real-time talent scoring.
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Models Active">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          </div>
        )}
      </div>
    </aside>
  );
};
