import { HttpException, HttpStatus } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

export async function checkUUID(id: string) {
  if (!uuidValidate(id)) {
    throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
  }
}
