
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubnetResult } from '../types/ipCalculator';
import { Clipboard, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ResultsCardProps {
  result: SubnetResult | null;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result }) => {
  const { language, translations } = useAppContext();
  const { toast } = useToast();
  const t = translations;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${t.copied[language]}: ${label}`,
      duration: 1500,
    });
  };

  if (!result) {
    return null;
  }

  const formatBinary = (binary: string): React.ReactNode => {
    const octets = [];
    for (let i = 0; i < binary.length; i += 8) {
      octets.push(binary.substring(i, i + 8));
    }
    
    return (
      <div className="flex flex-wrap gap-1 text-xs md:text-sm font-mono mt-1">
        {octets.map((octet, idx) => (
          <span key={idx} className="bg-muted p-1 rounded">
            {octet}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t.results[language]}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">{t.results[language]}</TabsTrigger>
            <TabsTrigger value="binary">{t.binaryRepresentation[language]}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.networkAddress[language]}:
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{result.networkAddress}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => copyToClipboard(result.networkAddress, t.networkAddress[language])}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.broadcastAddress[language]}:
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{result.broadcastAddress}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => copyToClipboard(result.broadcastAddress, t.broadcastAddress[language])}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.subnetMask[language]}:
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{result.subnetMask}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => copyToClipboard(result.subnetMask, t.subnetMask[language])}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.cidrNotation[language]}:
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{result.cidrNotation}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => copyToClipboard(result.cidrNotation, t.cidrNotation[language])}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.ipRange[language]}:
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs md:text-sm">
                      {result.firstUsableAddress} - {result.lastUsableAddress}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => copyToClipboard(`${result.firstUsableAddress} - ${result.lastUsableAddress}`, t.ipRange[language])}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.totalHosts[language]}:
                  </p>
                  <p className="font-mono">{result.totalHosts.toLocaleString()}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.usableHosts[language]}:
                  </p>
                  <p className="font-mono">{result.usableHosts.toLocaleString()}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.ipClass[language]}:
                  </p>
                  <p className="font-mono">{result.ipClass}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="binary" className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">{t.binaryIp[language]}:</p>
                {formatBinary(result.binaryIp)}
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">{t.binaryMask[language]}:</p>
                {formatBinary(result.binaryMask)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
