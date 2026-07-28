import { TakingsEntry } from '@finmid/lib-common/types';

/**
 * Spike from FIN-2231 ("one number for the haul"). Started, never finished,
 * never wired into any route — `GET /jobs` returns takings exactly as they were
 * entered.
 *
 * It stopped here because the rest of the asset types do not have an agreed
 * answer: gold is a weight against a price from some point in time, a bond has
 * a face value and a lower quote, goods have an appraisal and no buyer.
 * Somebody needs to make those calls before this is worth finishing.
 */
export class ValuationService {
  /**
   * Returns EUR cents, or null when this entry has no defensible EUR value
   * without a product decision.
   */
  static toEurCents(entry: TakingsEntry): number | null {
    if (entry.assetType === 'CASH' && entry.currency === 'EUR') {
      return Math.round(Number(entry.amount) * 100);
    }

    // TODO(FIN-2231): USD cash needs an FX source and a rate date.
    // TODO(FIN-2231): GOLD, BEARER_BOND, CRYPTO, GOODS unhandled.
    return null;
  }
}
