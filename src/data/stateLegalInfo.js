// State-specific legal information for police interactions
// This data would typically be stored in a database and managed by legal experts

export const stateLegalInfo = {
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    rightsSummary: `In California, you have the right to remain silent, refuse searches without a warrant, and record police interactions in public. You must provide identification during a lawful detention. California has strong privacy protections and requires consent for recording private conversations.`,
    doSayScript: `"I am exercising my right to remain silent."
"I do not consent to any searches."
"Am I free to leave?"
"I would like to speak with an attorney."
"I am recording this interaction for my safety."`,
    dontSayScript: `Don't argue or resist physically
Don't lie or provide false information
Don't consent to searches
Don't answer questions without an attorney present
Don't interfere with the officer's duties`,
    disclaimer: 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
    scenarios: {
      traffic_stop: {
        rights: 'During a traffic stop in California, you must provide your driver\'s license, registration, and insurance. You have the right to remain silent beyond providing required documents.',
        doSay: 'Provide required documents politely. Ask "Am I free to leave?" if the stop seems prolonged.',
        dontSay: 'Don\'t admit to speeding or other violations. Don\'t consent to vehicle searches.'
      },
      street_encounter: {
        rights: 'You have the right to walk away unless you\'re being detained. Police need reasonable suspicion to detain you.',
        doSay: '"Am I being detained or am I free to go?" If not detained, you may leave.',
        dontSay: 'Don\'t run away or resist. Don\'t provide information beyond what\'s legally required.'
      }
    }
  },
  NY: {
    stateCode: 'NY',
    stateName: 'New York',
    rightsSummary: `In New York, you have constitutional rights including the right to remain silent and refuse consent to searches. Stop-and-frisk requires reasonable suspicion. You may record police in public spaces. ID is required only during lawful arrests.`,
    doSayScript: `"I am exercising my right to remain silent."
"I do not consent to searches."
"Am I being detained?"
"I want to speak with a lawyer."
"I am recording this interaction."`,
    dontSayScript: `Don't resist or argue
Don't consent to searches
Don't answer questions without counsel
Don't interfere with police duties
Don't provide false information`,
    disclaimer: 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
    scenarios: {
      traffic_stop: {
        rights: 'Provide license, registration, and insurance when requested. You have the right to remain silent about other matters.',
        doSay: 'Be polite and provide required documents. Ask if you\'re free to leave.',
        dontSay: 'Don\'t admit fault or consent to vehicle searches.'
      },
      stop_and_frisk: {
        rights: 'Police need reasonable suspicion to stop and frisk. You can ask why you\'re being stopped.',
        doSay: '"Why am I being stopped?" "I do not consent to this search."',
        dontSay: 'Don\'t resist physically. Don\'t reach for anything without permission.'
      }
    }
  },
  TX: {
    stateCode: 'TX',
    stateName: 'Texas',
    rightsSummary: `In Texas, you have the right to remain silent and refuse consent to searches. You must identify yourself if lawfully arrested. Texas is a "stop and identify" state - you must provide your name if detained with reasonable suspicion.`,
    doSayScript: `"I am exercising my right to remain silent."
"I do not consent to any searches."
"Am I under arrest or free to go?"
"I want an attorney present."
"I am recording this interaction."`,
    dontSayScript: `Don't resist arrest or detention
Don't consent to searches
Don't answer questions beyond identification
Don't interfere with police work
Don't provide false identification`,
    disclaimer: 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
    scenarios: {
      traffic_stop: {
        rights: 'Must provide driver\'s license, registration, and insurance. Required to identify yourself if detained.',
        doSay: 'Provide required documents and identification when requested.',
        dontSay: 'Don\'t admit to violations or consent to vehicle searches.'
      },
      detention: {
        rights: 'Must provide your name if detained with reasonable suspicion. Can remain silent about other matters.',
        doSay: 'Provide your name if lawfully detained. Ask "Am I free to leave?"',
        dontSay: 'Don\'t refuse to identify yourself if lawfully detained.'
      }
    }
  },
  FL: {
    stateCode: 'FL',
    stateName: 'Florida',
    rightsSummary: `In Florida, you have the right to remain silent and refuse consent to searches. You must provide identification during lawful detention. Florida allows recording of police in public. Stop and frisk requires reasonable suspicion.`,
    doSayScript: `"I invoke my right to remain silent."
"I do not consent to searches."
"Am I being detained?"
"I request an attorney."
"I am recording this encounter."`,
    dontSayScript: `Don't resist or argue with officers
Don't consent to searches
Don't answer questions without a lawyer
Don't interfere with police duties
Don't provide false information`,
    disclaimer: 'This information is for educational purposes only and does not constitute legal advice. Laws may change and situations vary. Consult with a qualified attorney for specific legal guidance.',
    scenarios: {
      traffic_stop: {
        rights: 'Must provide driver\'s license, registration, and proof of insurance when requested.',
        doSay: 'Provide required documents politely. Ask if you\'re free to leave when appropriate.',
        dontSay: 'Don\'t admit to traffic violations or consent to vehicle searches.'
      },
      public_encounter: {
        rights: 'You can record police in public spaces. You have the right to remain silent.',
        doSay: 'State that you\'re recording. Ask if you\'re being detained.',
        dontSay: 'Don\'t interfere with police work while recording.'
      }
    }
  }
}

// Common scenarios across all states
export const commonScenarios = [
  {
    id: 'traffic_stop',
    name: 'Traffic Stop',
    description: 'Being pulled over while driving',
    icon: '🚗'
  },
  {
    id: 'street_encounter',
    name: 'Street Encounter',
    description: 'Being approached by police on the street',
    icon: '🚶'
  },
  {
    id: 'home_visit',
    name: 'Home Visit',
    description: 'Police coming to your residence',
    icon: '🏠'
  },
  {
    id: 'stop_and_frisk',
    name: 'Stop and Frisk',
    description: 'Being stopped and searched',
    icon: '🔍'
  },
  {
    id: 'arrest',
    name: 'Arrest Situation',
    description: 'Being placed under arrest',
    icon: '⚖️'
  },
  {
    id: 'questioning',
    name: 'Police Questioning',
    description: 'Being questioned by police',
    icon: '❓'
  }
]

// US States list for state selector
export const usStates = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
]

// Helper functions
export const getStateLegalInfo = (stateCode) => {
  return stateLegalInfo[stateCode] || null
}

export const getStateByCode = (stateCode) => {
  return usStates.find(state => state.code === stateCode)
}

export const getAllStatesWithInfo = () => {
  return usStates.filter(state => stateLegalInfo[state.code])
}

export default stateLegalInfo
