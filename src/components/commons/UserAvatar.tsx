// UserAvatar.tsx
import { User } from "lucide-react";

export const UserAvatar: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};