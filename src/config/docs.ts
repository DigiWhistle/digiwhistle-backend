import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Digiwhistle API',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Development Server'
    },
    {
      url: 'https://erp.digiwhistle.com/',
      description: 'Production Server'
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./src/v1/docs/*.yaml']
}

const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec
