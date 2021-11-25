// eslint-disable-next-line import/prefer-default-export
export const subscriptionResponse = {
  entries: [
    {
      id: 'cb437a56-8368-4f78-96c1-3a07fd56f37a',
      paused_at: '',
      event_type: 'scorecard.changed',
      delivery: {
        workflow: {
          name: 'send email',
          steps: [{ action: { url: { value: 'https://example.com/webhook' }, value: 'call_webhook' } }],
          filters: { changes: { grade: { value: 'any' }, value: 'grade_drop' }, scorecards: { value: 'followed' } },
        },
      },
      external_edit_url: '',
      created_by: 'user@securityscorecard.io',
      created_at: '2021-11-24T12:28:57.777Z',
      updated_by: 'user@securityscorecard.io',
      updated_at: '2021-11-24T12:28:57.777Z',
    },
  ],
  size: 1,
};
