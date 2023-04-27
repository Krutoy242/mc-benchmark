#!/usr/bin/env node
/**
 *
 * @param {{[key:string]: any}} _options
 * @returns {Promise<void>}
 */
export default function parseDebugLog(_options?: {
    [key: string]: any;
}): Promise<void>;
/**
 * @type {(debug_log: string) => [modName: string, loadTime: number, fileName: string][]}
 */
export const getModLoadTimeTuples: (debug_log: string) => [modName: string, loadTime: number, fileName: string][];
//# sourceMappingURL=index.d.ts.map