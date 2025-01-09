import { Auth } from '@auth/core';

export const auth = new Auth({
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: '497074437558-o2rdspogtcgrtr0ajq70roscb0fr9pt2.apps.googleusercontent.com',
      clientSecret: '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',
      authorization: {
        params: {
          prompt: "consent",s
          access_type: "offline",
          response_type: "code"
        }
      }
    }
  ],
  secret: 'd7e229c91bef4e7d8ec243e0d2f199e6'
});