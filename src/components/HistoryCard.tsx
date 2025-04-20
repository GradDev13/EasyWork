
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IpCalculationHistory } from '../types/ipCalculator';
import { Clipboard, History, Network } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryCardProps {
  onSelectHistory: (entry: IpCalculationHistory) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ onSelectHistory }) => {
  const { language, translations, history, clearHistory } = useAppContext();
  const t = translations;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{t.history[language]}</CardTitle>
          <CardDescription>
            {history.length > 0 
              ? `${history.length} ${history.length === 1 ? 'entrée' : 'entrées'}`
              : t.noHistory[language]
            }
          </CardDescription>
        </div>
        {history.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearHistory}
            className="text-destructive"
          >
            {t.clearHistory[language]}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <History className="h-12 w-12 mb-2 opacity-30" />
                <p>{t.noHistory[language]}</p>
              </div>
            ) : (
              history.map((entry) => (
                <Card 
                  key={entry.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onSelectHistory(entry)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <Network className="h-4 w-4 text-primary" />
                          {entry.ipAddress}{entry.result.cidrNotation}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t.calculatedAt[language]}: {formatTimestamp(entry.timestamp)}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center text-sm">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {entry.result.ipClass}
                        </span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {entry.result.usableHosts.toLocaleString()} {t.usableHosts[language]}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
