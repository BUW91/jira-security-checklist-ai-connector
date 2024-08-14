const { OpenAI } = require('openai');
const { convertToReadableContent } = require('./convertToReadable');

const openai = new OpenAI();

async function requestSecurityChecklist(summary, description) {
  const readableDescription = convertToReadableContent(description)
  const summaryAndDescription = summary + '\n' + readableDescription

  console.log(summaryAndDescription)
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system", content: `You are an expert security tester. You are provided a jira ticket with details about the work in scope. Write a security checklist for it. 
          Instructions:
          - Generate a checklist with exactly 10 items, each item phrased as a question.
          - Ensure each question is concise, with no more than 30 words per item.
          - Focus questions on OWASP security principles and tailor them closely to the specific details of the provided Jira story/task/ticket.
          - DO NOT include examples, filler words, or phrases such as "like," "for example," or "e.g."
          - DO NOT include questions formulated as 'Is ... tested'
          - Respond ONLY in the following JSON format, no additional text: [{label: <item>}, {label: <item>}, ... }]`
      },
      { role: "user", content: summaryAndDescription }
    ],
    model: "gpt-4o-mini",
    response_format: { "type": "json_object" }
  });

  console.log(completion.choices[0].message)
  const parsedResponse = JSON.parse(completion.choices[0].message.content)
  console.log(parsedResponse)
  return parsedResponse
}

module.exports = {
  requestSecurityChecklist
}