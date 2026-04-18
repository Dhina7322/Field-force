import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export function Placeholder({ title = 'Page Under Construction' }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-amber-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 max-w-md mb-8">
        We're working hard to bring you this feature. Please check back soon for updates!
      </p>
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </Button>
    </div>
  );
}
