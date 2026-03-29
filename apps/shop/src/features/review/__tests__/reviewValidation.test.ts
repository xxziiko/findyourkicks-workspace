import type { ReviewEligibility } from '@/features/review/types';
import { describe, expect, it } from 'vitest';

// ---------------------------------------------------------------------------
// Pure logic extracted from ReviewForm and review constants for unit testing.
//
// ReviewForm is a stateful React component.  We replicate the two pieces of
// pure business logic here:
//   1. Image selection limit enforced by handleImageChange
//   2. Submit guard that blocks submission when rating === 0
// ---------------------------------------------------------------------------

// ---- replicated constants --------------------------------------------------

const MAX_REVIEW_IMAGES = 3;

// ---- replicated logic -------------------------------------------------------

/**
 * Mirrors the handleImageChange logic in ReviewForm exactly.
 *
 * Given the current list of already-selected images and a new batch of files
 * chosen by the user, returns the updated image list after applying the cap.
 */
function applyImageSelection(currentFiles: File[], newFiles: File[]): File[] {
  const limited = newFiles.slice(0, MAX_REVIEW_IMAGES - currentFiles.length);
  return [...currentFiles, ...limited].slice(0, MAX_REVIEW_IMAGES);
}

/**
 * Mirrors the submit guard in handleSubmit: returns true when the form is
 * allowed to proceed, false when it should be blocked.
 */
function canSubmit(rating: number): boolean {
  return rating !== 0;
}

// ---- helpers ----------------------------------------------------------------

function makeFile(name: string): File {
  return new File([''], name, { type: 'image/jpeg' });
}

// ---- tests ------------------------------------------------------------------

describe('MAX_REVIEW_IMAGES', () => {
  it('is 3', () => {
    expect(MAX_REVIEW_IMAGES).toBe(3);
  });
});

describe('rating validation', () => {
  it('blocks submission when rating is 0', () => {
    expect(canSubmit(0)).toBe(false);
  });

  it('allows submission when rating is 1', () => {
    expect(canSubmit(1)).toBe(true);
  });

  it('allows submission when rating is 5', () => {
    expect(canSubmit(5)).toBe(true);
  });
});

describe('image count validation', () => {
  it('accepts up to MAX_REVIEW_IMAGES files from an empty selection', () => {
    const newFiles = [makeFile('a.jpg'), makeFile('b.jpg'), makeFile('c.jpg')];
    const result = applyImageSelection([], newFiles);
    expect(result).toHaveLength(MAX_REVIEW_IMAGES);
  });

  it('caps the total at MAX_REVIEW_IMAGES when new files exceed the remaining slots', () => {
    const existing = [makeFile('existing.jpg')];
    // 3 new files but only 2 slots remain
    const newFiles = [makeFile('x.jpg'), makeFile('y.jpg'), makeFile('z.jpg')];
    const result = applyImageSelection(existing, newFiles);
    expect(result).toHaveLength(MAX_REVIEW_IMAGES);
    expect(result[0]).toBe(existing[0]);
  });

  it('accepts no new files when MAX_REVIEW_IMAGES already selected', () => {
    const existing = [makeFile('a.jpg'), makeFile('b.jpg'), makeFile('c.jpg')];
    const result = applyImageSelection(existing, [makeFile('d.jpg')]);
    expect(result).toHaveLength(MAX_REVIEW_IMAGES);
    expect(result).toEqual(existing);
  });
});

describe('ReviewEligibility type', () => {
  it('canReview true has no reason', () => {
    const eligible: ReviewEligibility = { canReview: true };
    expect(eligible.canReview).toBe(true);
    expect(eligible.reason).toBeUndefined();
  });

  it('canReview false with NOT_PURCHASED reason', () => {
    const ineligible: ReviewEligibility = {
      canReview: false,
      reason: 'NOT_PURCHASED',
    };
    expect(ineligible.canReview).toBe(false);
    expect(ineligible.reason).toBe('NOT_PURCHASED');
  });

  it('canReview false with ALREADY_REVIEWED reason', () => {
    const ineligible: ReviewEligibility = {
      canReview: false,
      reason: 'ALREADY_REVIEWED',
    };
    expect(ineligible.canReview).toBe(false);
    expect(ineligible.reason).toBe('ALREADY_REVIEWED');
  });
});
