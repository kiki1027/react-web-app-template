import { BlRequest } from '@utils/request';

import { ILoginRequestBody } from './interface';

export const login = (loginRequestBody: ILoginRequestBody) => {
  return BlRequest.post('/login', loginRequestBody);
};
