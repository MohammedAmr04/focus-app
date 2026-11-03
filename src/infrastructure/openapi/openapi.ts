export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Focus API',
    version: '0.1.0',
    description: 'Backend API for the Focus & Productivity application.',
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Liveness check',
        description: 'Confirms that the API process is running.',
        responses: {
          '200': {
            description: 'API process is running.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['ok'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
