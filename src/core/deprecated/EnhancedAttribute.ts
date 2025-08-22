import type { IAttribute } from '@/core/types/index.js';

import { Attribute } from '@/core/attributes/Attribute.js';

/**
 * @deprecated Use Attribute instead.
 * @file Base attribute class.
 * @copyright Piggly Lab 2023
 */
export abstract class EnhancedAttribute<Props extends Record<any, any>>
	extends Attribute<Props>
	implements IAttribute<Props> {}
