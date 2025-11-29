import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHousehold, joinHousehold, validateHouseholdCode } from './household';
import { supabase } from './supabase';

// Mock Supabase client
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Household Lib', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createHousehold', () => {
    it('should create a household with a generated code', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: { id: '1', code: 'TEST12', name: 'My House' }, 
        error: null 
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      const result = await createHousehold('My House');

      expect(supabase.from).toHaveBeenCalledWith('households');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        name: 'My House',
        code: expect.any(String)
      }));
      expect(result).toEqual({ id: '1', code: 'TEST12', name: 'My House' });
    });

    it('should throw error if creation fails', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: new Error('DB Error') 
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      await expect(createHousehold('Fail House')).rejects.toThrow('DB Error');
    });
  });

  describe('joinHousehold', () => {
    it('should return household data for valid code', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: { id: '1', code: 'ABC123', name: 'Existing House' }, 
        error: null 
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const result = await joinHousehold('abc123'); // Lowercase input

      expect(supabase.from).toHaveBeenCalledWith('households');
      expect(mockEq).toHaveBeenCalledWith('code', 'ABC123'); // Should be uppercased
      expect(result).toEqual({ id: '1', code: 'ABC123', name: 'Existing House' });
    });

    it('should throw error for invalid code', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      await expect(joinHousehold('INVALID')).rejects.toThrow('Invalid household code');
    });
  });

  describe('validateHouseholdCode', () => {
    it('should return true if code exists', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: { id: '1' }, 
        error: null 
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const isValid = await validateHouseholdCode('EXIST');
      expect(isValid).toBe(true);
    });

    it('should return false if code does not exist', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const isValid = await validateHouseholdCode('NONE');
      expect(isValid).toBe(false);
    });
  });
});
