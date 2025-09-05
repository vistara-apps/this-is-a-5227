import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

export class OpenAIService {
  static async generateRightsSummary(stateCode, scenario = 'general') {
    try {
      const prompt = `Generate a concise, accurate summary of citizen rights during police interactions in ${stateCode}. 
      Focus on ${scenario} scenarios. Include:
      1. Key constitutional rights
      2. State-specific laws and protections
      3. What citizens can and cannot do
      4. Important disclaimers
      
      Keep it under 300 words and use clear, accessible language. Include a disclaimer that this is general information and not legal advice.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a legal information assistant specializing in citizen rights during police interactions. Provide accurate, state-specific information while emphasizing this is general guidance, not legal advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate rights summary')
    }
  }

  static async generateConversationScript(stateCode, scenario, language = 'en') {
    try {
      const languageInstruction = language === 'es' ? 'Respond in Spanish.' : 'Respond in English.'
      
      const prompt = `Generate conversation scripts for a ${scenario} scenario during a police interaction in ${stateCode}.
      
      Provide:
      1. "DO SAY" - Recommended phrases and responses
      2. "DON'T SAY" - Things to avoid saying
      3. Key actions to take
      4. Important reminders
      
      ${languageInstruction}
      Keep responses respectful, legally sound, and de-escalating. Include disclaimer about legal advice.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a legal guidance assistant. Provide practical, state-specific conversation scripts for police interactions. Always emphasize de-escalation and legal compliance. ${languageInstruction}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.2
      })

      return this.parseScriptResponse(response.choices[0].message.content)
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate conversation script')
    }
  }

  static async generateIncidentSummary(incidentData) {
    try {
      const prompt = `Create a professional incident summary based on the following information:
      
      Date/Time: ${incidentData.timestamp}
      Location: ${incidentData.location ? `${incidentData.location.lat}, ${incidentData.location.lng}` : 'Not specified'}
      Notes: ${incidentData.notes || 'No additional notes'}
      
      Generate a clear, factual summary suitable for documentation purposes. Keep it professional and objective.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional documentation assistant. Create clear, objective incident summaries based on provided information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate incident summary')
    }
  }

  static async generateShareableCard(incidentData) {
    try {
      const prompt = `Create a shareable incident card with the following information:
      
      Incident ID: ${incidentData.incidentId}
      Date: ${new Date(incidentData.timestamp).toLocaleDateString()}
      Time: ${new Date(incidentData.timestamp).toLocaleTimeString()}
      Location: ${incidentData.location ? 'Recorded' : 'Not specified'}
      
      Generate a professional, privacy-conscious summary that can be shared while protecting sensitive details.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are creating shareable incident cards. Focus on factual information while protecting privacy and sensitive details.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.2
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate shareable card')
    }
  }

  static parseScriptResponse(response) {
    // Parse the response to extract DO SAY and DON'T SAY sections
    const sections = {
      doSay: [],
      dontSay: [],
      keyActions: [],
      reminders: []
    }

    const lines = response.split('\n')
    let currentSection = null

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      if (trimmedLine.toLowerCase().includes('do say') || trimmedLine.toLowerCase().includes('recommended')) {
        currentSection = 'doSay'
      } else if (trimmedLine.toLowerCase().includes("don't say") || trimmedLine.toLowerCase().includes('avoid')) {
        currentSection = 'dontSay'
      } else if (trimmedLine.toLowerCase().includes('key actions') || trimmedLine.toLowerCase().includes('actions')) {
        currentSection = 'keyActions'
      } else if (trimmedLine.toLowerCase().includes('reminders') || trimmedLine.toLowerCase().includes('important')) {
        currentSection = 'reminders'
      } else if (currentSection && (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./))) {
        const cleanLine = trimmedLine.replace(/^[-•\d.]\s*/, '')
        sections[currentSection].push(cleanLine)
      }
    }

    return {
      doSayScript: sections.doSay.join('\n'),
      dontSayScript: sections.dontSay.join('\n'),
      keyActions: sections.keyActions.join('\n'),
      reminders: sections.reminders.join('\n'),
      fullResponse: response
    }
  }
}

export default OpenAIService
