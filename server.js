const fastify = require('fastify')({ logger: true });
const { requestSecurityChecklist } = require('./gpt/requestSecurityChecklist');

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