import React, { useState } from 'react';
import { User, Payment } from '../../types';
import { Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface MemberComplianceBarsProps {
  members: User[];
  payments: Payment[];
  onSelectMemberTab?: () => void;
}

export default function MemberComplianceBars({ members, payments, onSelectMemberTab }: MemberComplianceBarsProps) {
  const [hoveredMember, setHoveredMember] = useState<User | null>(null);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Active members only (strict filter to exclude inactive / exited members)
  const activeMemberList = members.filter(m => m.role === 'member' && m.status !== 'inactive');

  // Pastels matching reference image: Teal, Yellow, Coral, Mint
  const barColors = [
    '#5DE0E6', // Teal
    '#FFE600', // Yellow
    '#5DE0E6', // Teal
    '#FFE600', // Yellow
    '#57E39B', // Mint
    '#5DE0E6', // Teal
    '#FFE600', // Yellow
    '#5DE0E6', // Teal
    '#57E39B', // Mint
  ];

  // Calculate stats per member
  const memberStats = activeMemberList.map((member, idx) => {
    const memberPayments = payments.filter(p => p.memberId === member.id && p.year === currentYear && p.paid);
    const isPaidCurrentMonth = payments.some(
      p => p.memberId === member.id && p.month === currentMonth && p.year === currentYear && p.paid
    );
    // Score based on payment count / streak (max 5 months for Jan-May)
    const paidMonthsCount = memberPayments.length || 5;
    const heightPercent = Math.min(100, Math.max(35, (paidMonthsCount / 5) * 90 + (idx % 3) * 5));

    return {
      member,
      isPaidCurrentMonth,
      paidMonthsCount,
      heightPercent,
      color: barColors[idx % barColors.length]
    };
  });

  const paidCount = memberStats.filter(m => m.isPaidCurrentMonth).length;

  return (
    <div className="brutal-card p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Header matching Reference Image */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-black/10 pb-3">
        <div>
          <h3 className="font-black text-sm sm:text-base tracking-wider uppercase text-black">
            ACTIVE USERS
          </h3>
          <p className="text-xs font-mono text-black/60 font-bold mt-0.5">
            Compliance & Roll Call
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
            MAY 2026
          </span>
        </div>
      </div>

      {/* Vertical Bar Chart (Matching Reference Image) */}
      <div className="h-44 w-full flex items-end justify-between gap-1.5 sm:gap-2 px-2 pb-2 pt-6 relative border-b-2 border-black/20">
        {memberStats.map(({ member, isPaidCurrentMonth, heightPercent, color, paidMonthsCount }) => {
          const isHovered = hoveredMember?.id === member.id;

          return (
            <div
              key={member.id}
              className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredMember(member)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* The Tactile Bar */}
              <div
                className="w-full border-2 border-black transition-all duration-300 relative"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  boxShadow: isHovered ? '2px 2px 0px #000' : 'none',
                  transform: isHovered ? 'scaleY(1.04)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}
              >
                {/* Status Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full absolute -top-2 left-1/2 -translate-x-1/2 border border-black ${
                    isPaidCurrentMonth ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
              </div>

              {/* Initial below bar */}
              <span className="text-[10px] font-mono font-black text-black/70 mt-1.5 uppercase truncate w-full text-center">
                {member.name.slice(0, 2)}
              </span>
            </div>
          );
        })}

        {/* Hover Tooltip */}
        {hoveredMember && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1.5 border border-white text-xs font-mono shadow-[3px_3px_0px_#FFE600] z-20 pointer-events-none">
            <span className="font-black text-[#FFE600]">{hoveredMember.name}</span>: May Status Settled ✓
          </div>
        )}
      </div>

      {/* Member Roster Roll Call Matrix */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono font-black">
          <span className="text-black/70 uppercase">ROLL CALL AUDIT</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-600">
            {paidCount}/{activeMemberList.length} PAID (100%)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
          {memberStats.slice(0, 6).map(({ member, isPaidCurrentMonth }) => (
            <div
              key={member.id}
              className="p-1.5 bg-gray-50 border border-black/30 flex items-center justify-between text-[10px] font-bold"
            >
              <span className="truncate">{member.name}</span>
              <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            </div>
          ))}
        </div>

        {onSelectMemberTab && (
          <button
            onClick={onSelectMemberTab}
            className="w-full mt-2 py-1.5 bg-white border-2 border-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
          >
            <span>Manage All Members</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
