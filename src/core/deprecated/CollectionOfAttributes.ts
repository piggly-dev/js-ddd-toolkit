import type { IAttribute } from '@/core/types/index.js';

import { AbstractCollectionOfAttributes } from '@/core/deprecated/AbstractCollectionOfAttributes.js';

/**
 * @deprecated While you can still use it, it is not recommended. A Collection for attributes can produce unexpected results, since they are not immutable and can be modified.
 * @file A collection of attributes.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfAttributes<
	Attribute extends IAttribute<any>,
> extends AbstractCollectionOfAttributes<Attribute> {}
