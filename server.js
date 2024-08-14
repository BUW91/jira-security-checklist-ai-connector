const fastify = require('fastify')({ logger: true });
const { requestSecurityChecklist } = require('./gpt/requestSecurityChecklist.js');

fastify.post('/generate-security-checklist', async (request, reply) => {
    const { summary, description } = request.body;
    try{
      const checklist = await requestSecurityChecklist(summary, description);
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
