
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const { language } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-xl mt-4 mb-8">
          {language === 'fr' 
            ? 'Page non trouvée' 
            : 'Page not found'}
        </p>
        <Button onClick={() => navigate('/')}>
          {language === 'fr' ? 'Retourner à l\'accueil' : 'Return to home'}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
