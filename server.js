const fastify = require('fastify')({ logger: true });
const { requestSecurityChecklist } = require('./gpt/requestSecurityChecklist.js');

fastify.post('/generate-security-checklist', async (request, reply) => {
    const { summary, description } = request.body;
    try{
      const checklist = await requestSecurityChecklist(summary, description);
      console.log(checklist)
      reply.send(checklist);
    }
    catch(e) {
      console.log(e)
      return reply.status(500).send(e)
    }
  
  });

  const start = async () => {
    try {
      await fastify.listen({ port: 3000, host: '0.0.0.0' });
      fastify.log.info(`Server is running on ${fastify.server.address().port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  
  start();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing MongoDB connection');
    await closeDbConnection();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing MongoDB connection');
    await closeDbConnection();
    process.exit(0);
  });