import { AbstractCollectionOfEnhancedAttributes } from '@/core/deprecated/AbstractCollectionOfEnhancedAttributes.js';
import { EnhancedAttribute } from '@/core/deprecated/EnhancedAttribute.js';

/**
 * @deprecated Use CollectionOfAttributes instead.
 * @file A collection of attributes.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfEnhancedAttributes<
	Attribute extends EnhancedAttribute<any>,
> extends AbstractCollectionOfEnhancedAttributes<Attribute> {}
