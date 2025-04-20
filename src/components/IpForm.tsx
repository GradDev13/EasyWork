
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  calculateSubnet, 
  isValidIpAddress, 
  isValidCidr, 
  isValidSubnetMask 
} from '../utils/ipUtils';
import { SubnetResult } from '../types/ipCalculator';

interface IpFormProps {
  onCalculate: (result: SubnetResult, ipAddress: string, subnetMask: string) => void;
}

const IpForm: React.FC<IpFormProps> = ({ onCalculate }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [ipError, setIpError] = useState('');
  const [maskError, setMaskError] = useState('');
  const { language, translations } = useAppContext();
  const { toast } = useToast();
  const t = translations;

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validation de l'adresse IP
    if (!isValidIpAddress(ipAddress)) {
      setIpError(t.ipError[language]);
      isValid = false;
    } else {
      setIpError('');
    }
    
    // Validation du masque de sous-réseau
    if (!isValidCidr(subnetMask) && !isValidSubnetMask(subnetMask)) {
      setMaskError(t.maskError[language]);
      isValid = false;
    } else {
      setMaskError('');
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const result = calculateSubnet(ipAddress, subnetMask);
        onCalculate(result, ipAddress, subnetMask);
        
        toast({
          title: t.calculationSuccess[language],
          description: `${ipAddress} ${result.cidrNotation}`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: (error as Error).message,
        });
      }
    }
  };

  const handleReset = () => {
    setIpAddress('');
    setSubnetMask('');
    setIpError('');
    setMaskError('');
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ipAddress">{t.ipAddress[language]}</Label>
            <Input
              id="ipAddress"
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="192.168.1.0"
            />
            {ipError && <p className="text-destructive text-sm">{ipError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subnetMask">{t.subnetMask[language]}</Label>
            <Input
              id="subnetMask"
              type="text"
              value={subnetMask}
              onChange={(e) => setSubnetMask(e.target.value)}
              placeholder="/24 ou 255.255.255.0"
            />
            {maskError && <p className="text-destructive text-sm">{maskError}</p>}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-easywork-blue hover:bg-easywork-blue-dark">
              {t.calculate[language]}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              {t.reset[language]}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IpForm;
