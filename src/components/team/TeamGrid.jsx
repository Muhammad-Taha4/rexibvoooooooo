import { MemberCard } from './MemberCard';

export const TeamGrid = ({ members, statsByMember, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
      {members.map((member) => (
        <MemberCard 
          key={member.id} 
          member={member} 
          stats={statsByMember[member.id] || { revenue: 0, profit: 0, salesCount: 0, pendingCount: 0 }} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
