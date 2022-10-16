/**
 * Helper so we can have a const object as enum, and a type as its value.
 *
 * ```typescript
 * const StatusEnum = {
 *   Active: 'ACTIVE',
 *   Inactive: 'INACTIVE',
 * } as const;
 *
 * type StatusType = Values<typeof StatusEnum>; // 'ACTIVE' | 'INACTIVE'
 * ```
 */
export type Values<T> = T[keyof T];
