import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, validateSync } from 'class-validator';

/**
 * Dynamically create a DTO class with validation decorators and Swagger docs.
 *
 * @param props An object with property names and metadata:
 *   - type: 'string' | 'int'
 *   - example: any
 *   - required: boolean (default: true)
 */
export function createSimpleDto(
  props: Record<string, { type: 'string' | 'int'; example: any; required?: boolean }>,
  className = 'DynamicDto',
) {
  const DynamicDto = class {};
  Object.defineProperty(DynamicDto, 'name', { value: className });

  for (const key in props) {
    const metadata = props[key];
    const required = metadata.required !== false;

    ApiProperty({ example: metadata.example })(DynamicDto.prototype, key);

    if (metadata.type === 'string') {
      IsString()(DynamicDto.prototype, key);
    } else if (metadata.type === 'int') {
      IsInt()(DynamicDto.prototype, key);
    }

    if (required) {
      IsNotEmpty()(DynamicDto.prototype, key);
    }
  }

  return DynamicDto;
}

