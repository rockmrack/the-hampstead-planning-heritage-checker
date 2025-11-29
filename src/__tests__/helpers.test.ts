import {
  extractPostcode,
  formatPostcode,
  isValidUKPostcode,
  isWithinLondonBounds,
  formatDate,
  slugify,
  truncate,
  sanitizeInput,
  debounce,
  hashString,
} from '@/lib/utils/helpers';

describe('Helpers', () => {
  describe('extractPostcode', () => {
    it('should extract postcode from address', () => {
      expect(extractPostcode('10 Flask Walk, Hampstead, London NW3 1HE')).toBe('NW3 1HE');
      expect(extractPostcode('100 Abbey Road, St Johns Wood NW8 9AY')).toBe('NW8 9AY');
    });

    it('should return null for addresses without postcode', () => {
      expect(extractPostcode('10 Flask Walk, Hampstead')).toBeNull();
    });

    it('should handle various postcode formats', () => {
      expect(extractPostcode('Address N6 5QA')).toBe('N6 5QA');
      expect(extractPostcode('Address W1A 1AA')).toBe('W1A 1AA');
    });
  });

  describe('formatPostcode', () => {
    it('should format postcode with correct spacing', () => {
      expect(formatPostcode('NW31HE')).toBe('NW3 1HE');
      expect(formatPostcode('nw31he')).toBe('NW3 1HE');
      expect(formatPostcode('NW3 1HE')).toBe('NW3 1HE');
    });
  });

  describe('isValidUKPostcode', () => {
    it('should validate correct UK postcodes', () => {
      expect(isValidUKPostcode('NW3 1HE')).toBe(true);
      expect(isValidUKPostcode('NW31HE')).toBe(true);
      expect(isValidUKPostcode('W1A 1AA')).toBe(true);
      expect(isValidUKPostcode('EC1A 1BB')).toBe(true);
    });

    it('should reject invalid postcodes', () => {
      expect(isValidUKPostcode('invalid')).toBe(false);
      expect(isValidUKPostcode('12345')).toBe(false);
      expect(isValidUKPostcode('')).toBe(false);
    });
  });

  describe('isWithinLondonBounds', () => {
    it('should return true for coordinates within London', () => {
      // Hampstead
      expect(isWithinLondonBounds(-0.1780, 51.5575)).toBe(true);
      // Central London
      expect(isWithinLondonBounds(-0.1276, 51.5074)).toBe(true);
    });

    it('should return false for coordinates outside London', () => {
      // Manchester
      expect(isWithinLondonBounds(-2.2426, 53.4808)).toBe(false);
      // Paris
      expect(isWithinLondonBounds(2.3522, 48.8566)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toMatch(/15/);
      expect(formatDate(date)).toMatch(/Jan|January/i);
      expect(formatDate(date)).toMatch(/2024/);
    });

    it('should handle string dates', () => {
      expect(formatDate('2024-01-15')).toMatch(/15/);
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hampstead Conservation Area')).toBe('hampstead-conservation-area');
      expect(slugify('Test 123!')).toBe('test-123');
    });

    it('should handle special characters', () => {
      expect(slugify("St John's Wood")).toBe('st-johns-wood');
      expect(slugify('Test & Test')).toBe('test-test');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Short', 20)).toBe('Short');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<script>');
      expect(sanitizeInput('Normal text')).toBe('Normal text');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  text  ')).toBe('text');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('hashString', () => {
    it('should produce consistent hashes', () => {
      const hash1 = hashString('test');
      const hash2 = hashString('test');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashString('test1');
      const hash2 = hashString('test2');
      expect(hash1).not.toBe(hash2);
    });
  });
});
