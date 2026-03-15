import { describe, expect, it } from 'vitest';
import { userAddressSchema } from './types';

// ---------------------------------------------------------------------------
// Tests for the userAddressSchema Zod schema.
// Each test verifies one validation rule.
// ---------------------------------------------------------------------------

const validAddress = {
  addressId: 'addr-1',
  alias: '집',
  receiverName: '홍길동',
  receiverPhone: '010-1234-5678',
  address: '서울특별시 강남구 테헤란로 123',
  message: '문 앞에 놔주세요',
  isDefault: true,
};

describe('userAddressSchema validation', () => {
  // ----- valid input --------------------------------------------------------

  describe('when all required fields are provided', () => {
    it('passes validation for a fully populated address', () => {
      const result = userAddressSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it('passes validation when message is omitted (defaults to empty string)', () => {
      const { message: _, ...withoutMessage } = validAddress;
      const result = userAddressSchema.safeParse(withoutMessage);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('');
      }
    });

    it('passes validation when isDefault is omitted (defaults to false)', () => {
      const { isDefault: _, ...withoutIsDefault } = validAddress;
      const result = userAddressSchema.safeParse(withoutIsDefault);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isDefault).toBe(false);
      }
    });
  });

  // ----- required string fields cannot be empty ----------------------------

  describe('when required string fields are empty', () => {
    it('fails validation when addressId is an empty string', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        addressId: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails validation when alias is an empty string', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        alias: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails validation when receiverName is an empty string', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        receiverName: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails validation when receiverPhone is an empty string', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        receiverPhone: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails validation when address is an empty string', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        address: '',
      });
      expect(result.success).toBe(false);
    });
  });

  // ----- required fields cannot be missing ----------------------------------

  describe('when required fields are missing', () => {
    it('fails validation when addressId is missing', () => {
      const { addressId: _, ...rest } = validAddress;
      const result = userAddressSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('fails validation when receiverName is missing', () => {
      const { receiverName: _, ...rest } = validAddress;
      const result = userAddressSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('fails validation when address is missing', () => {
      const { address: _, ...rest } = validAddress;
      const result = userAddressSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });
  });

  // ----- optional field defaults --------------------------------------------

  describe('optional fields with defaults', () => {
    it('sets message to empty string when not provided', () => {
      const { message: _, ...rest } = validAddress;
      const result = userAddressSchema.safeParse(rest);
      if (result.success) {
        expect(result.data.message).toBe('');
      }
    });

    it('sets isDefault to false when not provided', () => {
      const { isDefault: _, ...rest } = validAddress;
      const result = userAddressSchema.safeParse(rest);
      if (result.success) {
        expect(result.data.isDefault).toBe(false);
      }
    });

    it('accepts an explicit empty string for message', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        message: '',
      });
      expect(result.success).toBe(true);
    });

    it('accepts false for isDefault', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        isDefault: false,
      });
      expect(result.success).toBe(true);
    });
  });

  // ----- type errors --------------------------------------------------------

  describe('when field types are wrong', () => {
    it('fails validation when isDefault is a string instead of boolean', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        isDefault: 'yes',
      });
      expect(result.success).toBe(false);
    });

    it('fails validation when addressId is a number instead of string', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        addressId: 42,
      });
      expect(result.success).toBe(false);
    });
  });

  // ----- error path reporting -----------------------------------------------

  describe('Zod error paths', () => {
    it('reports the correct field path when receiverPhone is empty', () => {
      const result = userAddressSchema.safeParse({
        ...validAddress,
        receiverPhone: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('receiverPhone');
      }
    });

    it('reports the correct field path when alias is missing', () => {
      const { alias: _, ...rest } = validAddress;
      const result = userAddressSchema.safeParse(rest);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('alias');
      }
    });
  });
});
