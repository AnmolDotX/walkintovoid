import { Info, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning';
  children: React.ReactNode;
}

const Callout = ({ children, type = 'info' }: CalloutProps) => {
  const baseClasses = 'px-4 py-3 rounded-md my-6 border';
  const typeClasses = {
    info: 'bg-blue-950 border-blue-500 text-blue-200',
    warning: 'bg-yellow-950 border-yellow-500 text-yellow-200',
  };

  const Icon = type === 'info' ? Info : AlertTriangle;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
        <div className="prose prose-invert prose-p:my-0">{children}</div>
      </div>
    </div>
  );
};

export default Callout;
