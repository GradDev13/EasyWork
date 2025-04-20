
export interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstUsableAddress: string;
  lastUsableAddress: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  subnetMask: string;
  cidrNotation: string;
  binaryIp: string;
  binaryMask: string;
}

export interface IpCalculationHistory {
  id: string;
  timestamp: number;
  ipAddress: string;
  subnetMask: string;
  result: SubnetResult;
}
