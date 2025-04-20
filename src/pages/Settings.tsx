
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Settings = () => {
  const { language, setLanguage, theme, toggleTheme, translations } = useAppContext();
  const t = translations;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 md:py-10">
        <div className="max-w-xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings[language]}</CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Personnalisez l\'apparence et le comportement de l\'application.' 
                  : 'Customize the look and behavior of the application.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.darkMode[language]}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' 
                      ? 'Basculer entre le mode clair et sombre.' 
                      : 'Toggle between light and dark mode.'}
                  </p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                <Label>{t.language[language]}</Label>
                <RadioGroup value={language} onValueChange={(value: any) => setLanguage(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fr" id="fr" />
                    <Label htmlFor="fr">Français</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="en" />
                    <Label htmlFor="en">English</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? 'À propos' : 'About'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' 
                  ? 'EasyWork est un calculateur de sous-réseau IP qui permet de déterminer rapidement les informations essentielles d\'un sous-réseau à partir d\'une adresse IP et d\'un masque de sous-réseau.' 
                  : 'EasyWork is an IP subnet calculator that quickly determines essential subnet information from an IP address and subnet mask.'}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {language === 'fr' 
                  ? 'Version: 1.0.0' 
                  : 'Version: 1.0.0'}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
