
import { SubnetResult } from "../types/ipCalculator";

// Fonction pour vérifier si une adresse IP est valide
export function isValidIpAddress(ip: string): boolean {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

// Fonction pour vérifier si un masque CIDR est valide (de /0 à /32)
export function isValidCidr(cidr: string): boolean {
  if (cidr.startsWith('/')) {
    const prefix = parseInt(cidr.substring(1), 10);
    return !isNaN(prefix) && prefix >= 0 && prefix <= 32;
  }
  return false;
}

// Fonction pour vérifier si un masque en notation décimale est valide
export function isValidSubnetMask(mask: string): boolean {
  // Liste des masques de sous-réseau valides
  const validMasks = [
    "0.0.0.0", "128.0.0.0", "192.0.0.0", "224.0.0.0", "240.0.0.0",
    "248.0.0.0", "252.0.0.0", "254.0.0.0", "255.0.0.0", "255.128.0.0",
    "255.192.0.0", "255.224.0.0", "255.240.0.0", "255.248.0.0",
    "255.252.0.0", "255.254.0.0", "255.255.0.0", "255.255.128.0",
    "255.255.192.0", "255.255.224.0", "255.255.240.0", "255.255.248.0",
    "255.255.252.0", "255.255.254.0", "255.255.255.0", "255.255.255.128",
    "255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.248",
    "255.255.255.252", "255.255.255.254", "255.255.255.255"
  ];
  
  return validMasks.includes(mask);
}

// Convertir IP en binaire
export function ipToBinary(ip: string): string {
  return ip
    .split('.')
    .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('');
}

// Convertir binaire en IP
export function binaryToIp(binary: string): string {
  const octets: string[] = [];
  for (let i = 0; i < 32; i += 8) {
    octets.push(parseInt(binary.substring(i, i + 8), 2).toString());
  }
  return octets.join('.');
}

// Convertir masque CIDR en masque décimal
export function cidrToSubnetMask(cidr: string): string {
  const prefix = parseInt(cidr.substring(1), 10);
  const binaryMask = '1'.repeat(prefix) + '0'.repeat(32 - prefix);
  return binaryToIp(binaryMask);
}

// Convertir masque décimal en CIDR
export function subnetMaskToCidr(mask: string): string {
  const binary = ipToBinary(mask);
  const prefix = binary.split('0')[0].length;
  return `/${prefix}`;
}

// Déterminer la classe d'adresse IP
export function getIpClass(ip: string): string {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Réservée)';
  return 'Spéciale';
}

// Calculer les informations du sous-réseau
export function calculateSubnet(ipAddress: string, subnetMask: string): SubnetResult {
  let cidrNotation: string;
  let maskDecimal: string;
  
  // Déterminer si l'entrée est en CIDR ou en masque décimal
  if (subnetMask.startsWith('/')) {
    cidrNotation = subnetMask;
    maskDecimal = cidrToSubnetMask(subnetMask);
  } else {
    maskDecimal = subnetMask;
    cidrNotation = subnetMaskToCidr(subnetMask);
  }
  
  const ipBinary = ipToBinary(ipAddress);
  const maskBinary = ipToBinary(maskDecimal);
  
  // Calculer l'adresse réseau
  let networkBinary = '';
  for (let i = 0; i < 32; i++) {
    networkBinary += (parseInt(ipBinary[i], 10) & parseInt(maskBinary[i], 10)).toString();
  }
  const networkAddress = binaryToIp(networkBinary);
  
  // Calculer l'adresse broadcast
  let broadcastBinary = '';
  for (let i = 0; i < 32; i++) {
    if (maskBinary[i] === '1') {
      broadcastBinary += networkBinary[i];
    } else {
      broadcastBinary += '1';
    }
  }
  const broadcastAddress = binaryToIp(broadcastBinary);
  
  // Calculer la première adresse utilisable
  let firstUsableBinary = networkBinary;
  // Si le réseau n'est pas /31 ou /32, alors la première adresse utilisable est network+1
  if (cidrNotation !== '/31' && cidrNotation !== '/32') {
    const networkBinaryArray = networkBinary.split('');
    let done = false;
    for (let i = 31; i >= 0; i--) {
      if (!done && networkBinaryArray[i] === '0') {
        networkBinaryArray[i] = '1';
        done = true;
      }
    }
    firstUsableBinary = networkBinaryArray.join('');
  }
  const firstUsableAddress = binaryToIp(firstUsableBinary);
  
  // Calculer la dernière adresse utilisable
  let lastUsableBinary = broadcastBinary;
  // Si le réseau n'est pas /31 ou /32, alors la dernière adresse utilisable est broadcast-1
  if (cidrNotation !== '/31' && cidrNotation !== '/32') {
    const broadcastBinaryArray = broadcastBinary.split('');
    let done = false;
    for (let i = 31; i >= 0; i--) {
      if (!done && broadcastBinaryArray[i] === '1') {
        broadcastBinaryArray[i] = '0';
        done = true;
      }
    }
    lastUsableBinary = broadcastBinaryArray.join('');
  }
  const lastUsableAddress = binaryToIp(lastUsableBinary);
  
  // Calculer le nombre total d'adresses
  const prefix = parseInt(cidrNotation.substring(1), 10);
  const totalHosts = Math.pow(2, 32 - prefix);
  
  // Calculer le nombre d'adresses utilisables (total moins network et broadcast)
  let usableHosts = totalHosts - 2;
  // Pour /31, il y a 2 adresses utilisables, pour /32 il y a 1 adresse
  if (prefix === 31) usableHosts = 2;
  if (prefix === 32) usableHosts = 1;
  
  // Déterminer la classe IP
  const ipClass = getIpClass(ipAddress);
  
  return {
    networkAddress,
    broadcastAddress,
    firstUsableAddress,
    lastUsableAddress,
    totalHosts,
    usableHosts: usableHosts < 0 ? 0 : usableHosts,
    ipClass,
    subnetMask: maskDecimal,
    cidrNotation,
    binaryIp: ipBinary,
    binaryMask: maskBinary
  };
}
