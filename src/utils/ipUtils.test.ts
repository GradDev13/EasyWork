
import { describe, it, expect } from 'vitest';
import {
  isValidIpAddress,
  isValidCidr,
  isValidSubnetMask,
  ipToBinary,
  binaryToIp,
  cidrToSubnetMask,
  subnetMaskToCidr,
  getIpClass,
  calculateSubnet
} from './ipUtils';

describe('IP Utilities', () => {
  describe('isValidIpAddress', () => {
    it('should validate correct IP addresses', () => {
      expect(isValidIpAddress('192.168.1.1')).toBe(true);
      expect(isValidIpAddress('10.0.0.1')).toBe(true);
      expect(isValidIpAddress('172.16.0.1')).toBe(true);
      expect(isValidIpAddress('255.255.255.255')).toBe(true);
      expect(isValidIpAddress('0.0.0.0')).toBe(true);
    });

    it('should reject invalid IP addresses', () => {
      expect(isValidIpAddress('256.168.1.1')).toBe(false);
      expect(isValidIpAddress('192.168.1')).toBe(false);
      expect(isValidIpAddress('192.168.1.1.1')).toBe(false);
      expect(isValidIpAddress('192.168.1.-1')).toBe(false);
      expect(isValidIpAddress('not-an-ip')).toBe(false);
    });
  });

  describe('isValidCidr', () => {
    it('should validate correct CIDR notations', () => {
      expect(isValidCidr('/24')).toBe(true);
      expect(isValidCidr('/0')).toBe(true);
      expect(isValidCidr('/32')).toBe(true);
    });

    it('should reject invalid CIDR notations', () => {
      expect(isValidCidr('24')).toBe(false);
      expect(isValidCidr('/33')).toBe(false);
      expect(isValidCidr('/-1')).toBe(false);
      expect(isValidCidr('/abc')).toBe(false);
    });
  });

  describe('isValidSubnetMask', () => {
    it('should validate correct subnet masks', () => {
      expect(isValidSubnetMask('255.255.255.0')).toBe(true);
      expect(isValidSubnetMask('255.255.0.0')).toBe(true);
      expect(isValidSubnetMask('255.0.0.0')).toBe(true);
      expect(isValidSubnetMask('0.0.0.0')).toBe(true);
      expect(isValidSubnetMask('255.255.255.255')).toBe(true);
    });

    it('should reject invalid subnet masks', () => {
      expect(isValidSubnetMask('255.255.255.1')).toBe(false);
      expect(isValidSubnetMask('254.0.0.0')).toBe(false);
      expect(isValidSubnetMask('256.0.0.0')).toBe(false);
    });
  });

  describe('ipToBinary and binaryToIp', () => {
    it('should convert IP to binary and back', () => {
      const testIp = '192.168.1.1';
      const binary = ipToBinary(testIp);
      expect(binary).toBe('11000000101010000000000100000001');
      expect(binaryToIp(binary)).toBe(testIp);
    });
  });

  describe('cidrToSubnetMask and subnetMaskToCidr', () => {
    it('should convert CIDR to subnet mask and back', () => {
      expect(cidrToSubnetMask('/24')).toBe('255.255.255.0');
      expect(cidrToSubnetMask('/16')).toBe('255.255.0.0');
      expect(cidrToSubnetMask('/8')).toBe('255.0.0.0');
      expect(cidrToSubnetMask('/0')).toBe('0.0.0.0');
      expect(cidrToSubnetMask('/32')).toBe('255.255.255.255');
      
      expect(subnetMaskToCidr('255.255.255.0')).toBe('/24');
      expect(subnetMaskToCidr('255.255.0.0')).toBe('/16');
      expect(subnetMaskToCidr('255.0.0.0')).toBe('/8');
      expect(subnetMaskToCidr('0.0.0.0')).toBe('/0');
      expect(subnetMaskToCidr('255.255.255.255')).toBe('/32');
    });
  });

  describe('getIpClass', () => {
    it('should identify IP classes correctly', () => {
      expect(getIpClass('10.0.0.1')).toBe('A');
      expect(getIpClass('126.0.0.1')).toBe('A');
      expect(getIpClass('128.0.0.1')).toBe('B');
      expect(getIpClass('191.0.0.1')).toBe('B');
      expect(getIpClass('192.0.0.1')).toBe('C');
      expect(getIpClass('223.0.0.1')).toBe('C');
      expect(getIpClass('224.0.0.1')).toBe('D (Multicast)');
      expect(getIpClass('239.0.0.1')).toBe('D (Multicast)');
      expect(getIpClass('240.0.0.1')).toBe('E (Réservée)');
      expect(getIpClass('255.0.0.1')).toBe('E (Réservée)');
    });
  });

  describe('calculateSubnet', () => {
    it('should calculate subnet information correctly for a Class C network', () => {
      const result = calculateSubnet('192.168.1.0', '/24');
      
      expect(result.networkAddress).toBe('192.168.1.0');
      expect(result.broadcastAddress).toBe('192.168.1.255');
      expect(result.firstUsableAddress).toBe('192.168.1.1');
      expect(result.lastUsableAddress).toBe('192.168.1.254');
      expect(result.totalHosts).toBe(256);
      expect(result.usableHosts).toBe(254);
      expect(result.ipClass).toBe('C');
      expect(result.subnetMask).toBe('255.255.255.0');
      expect(result.cidrNotation).toBe('/24');
    });

    it('should handle /32 networks correctly', () => {
      const result = calculateSubnet('192.168.1.1', '/32');
      
      expect(result.networkAddress).toBe('192.168.1.1');
      expect(result.broadcastAddress).toBe('192.168.1.1');
      expect(result.firstUsableAddress).toBe('192.168.1.1');
      expect(result.lastUsableAddress).toBe('192.168.1.1');
      expect(result.totalHosts).toBe(1);
      expect(result.usableHosts).toBe(1);
    });

    it('should handle /31 networks correctly', () => {
      const result = calculateSubnet('192.168.1.0', '/31');
      
      expect(result.networkAddress).toBe('192.168.1.0');
      expect(result.broadcastAddress).toBe('192.168.1.1');
      expect(result.firstUsableAddress).toBe('192.168.1.0');
      expect(result.lastUsableAddress).toBe('192.168.1.1');
      expect(result.totalHosts).toBe(2);
      expect(result.usableHosts).toBe(2);
    });

    it('should accept subnet mask in decimal notation', () => {
      const result = calculateSubnet('192.168.1.0', '255.255.255.0');
      
      expect(result.cidrNotation).toBe('/24');
      expect(result.subnetMask).toBe('255.255.255.0');
    });
  });
});
