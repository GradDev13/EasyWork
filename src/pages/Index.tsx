
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import IpForm from '../components/IpForm';
import ResultsCard from '../components/ResultsCard';
import HistoryCard from '../components/HistoryCard';
import Header from '../components/Header';
import { SubnetResult } from '../types/ipCalculator';

const Index = () => {
  const [results, setResults] = useState<SubnetResult | null>(null);
  const { addToHistory } = useAppContext();

  const handleCalculate = (result: SubnetResult, ipAddress: string, subnetMask: string) => {
    setResults(result);
    addToHistory({
      ipAddress,
      subnetMask,
      result
    });
  };

  const handleSelectHistory = (entry: any) => {
    setResults(entry.result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 md:py-10 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <IpForm onCalculate={handleCalculate} />
            <ResultsCard result={results} />
          </div>
          <HistoryCard onSelectHistory={handleSelectHistory} />
        </div>
      </main>
    </div>
  );
};

export default Index;
