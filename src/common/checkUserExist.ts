import { HttpException, HttpStatus } from '@nestjs/common';

export async function cheskIsExists(id: string, prisma: any) {
  const result = await prisma.findUnique({
    where: {
      id: id,
    },
  });
  if (!result) {
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }
  return result;
}
