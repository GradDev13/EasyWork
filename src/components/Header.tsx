
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Settings } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, translations } = useAppContext();
  const t = translations;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-background border-b py-3 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          EasyWork
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Navigation */}
        <div className="hidden md:flex space-x-2 mr-4">
          <Button
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/')}
          >
            {t.home[language]}
          </Button>
          <Button
            variant={location.pathname === '/settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/settings')}
          >
            {t.settings[language]}
          </Button>
        </div>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {language.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('fr')}>
              Français
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>

        {/* Mobile Settings Button */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
