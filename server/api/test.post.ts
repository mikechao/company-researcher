import consola from 'consola'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { EVENT_NAMES } from '~/types/constants'

export default defineLazyEventHandler(async () => {
  const inputSchema = z.object({
    sessionId: z.string().min(1, { message: 'Session ID is required' }),
    company: z.string().min(1, { message: 'Company name is required' }),
    maxSearchQueries: z.number().optional().default(3),
    maxSearchResults: z.number().optional().default(3),
    maxReflectionSteps: z.number().optional().default(0),
    includeSearchResults: z.boolean().optional().default(false),
    userNotes: z.string().optional().default(''),
  })

  function timestamp(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }).toString()
  }

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function encode(eventName: string, data: ResearchEvent): string {
    return `2:[{"id":"${uuidv4()}","name":"${eventName}","data":${JSON.stringify(data)}}]\n`
  }

  return defineEventHandler(async (webEvent) => {
    const body = await readBody(webEvent)
    const parsedBody = inputSchema.safeParse(body)
    if (!parsedBody.success) {
      const formattedError = parsedBody.error.flatten()
      consola.error({ tag: 'eventHandler', message: `Invalid input: ${JSON.stringify(formattedError)}` })
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: JSON.stringify(formattedError) || 'Invalid input',
      })
    }
    const validatedBody = parsedBody.data
    consola.debug({ tag: 'eventHandler', message: `Received input: ${JSON.stringify(validatedBody)}` })
    return new ReadableStream({
      async start(controller) {
        await delay(1000)
        const queryEvent: ResearchEvent = {
          event: EVENT_NAMES.GENERATE_QUERIES,
          data: { queries: [
            'Apple Inc company history founders Steve Jobs Steve Wozniak founding year',
            'Apple Inc financial history funding investment IPO company profile',
            'Apple Inc main products services iPhone Mac description overview',
          ] },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.GENERATE_QUERIES, queryEvent))
        await delay(500)
        const beforeExecute: ResearchEvent = {
          event: EVENT_NAMES.BEFORE_EXECUTE_QUERIES,
          data: { time: performance.now() },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.BEFORE_EXECUTE_QUERIES, beforeExecute))
        await delay(1500)
        const afterExecute: ResearchEvent = {
          event: EVENT_NAMES.AFTER_EXECUTE_QUERIES,
          data: { time: performance.now() },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.AFTER_EXECUTE_QUERIES, afterExecute))
        await delay(100)
        const generateNotes: ResearchEvent = {
          event: EVENT_NAMES.GENERATE_NOTES,
          data: { notesSize: 42 },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.GENERATE_NOTES, generateNotes))
        await delay(100)
        const beforeNotes: ResearchEvent = {
          event: EVENT_NAMES.BEFORE_NOTES_TO_SCHEMA,
          data: { time: performance.now() },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.BEFORE_NOTES_TO_SCHEMA, beforeNotes))
        await delay(2000)
        const afterNotes: ResearchEvent = {
          event: EVENT_NAMES.AFTER_NOTES_TO_SCHEMA,
          data: { time: performance.now() },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.AFTER_NOTES_TO_SCHEMA, afterNotes))
        await delay(100)
        const beforeReflection: ResearchEvent = {
          event: EVENT_NAMES.BEFORE_REFLECTION,
          data: { time: performance.now() },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.BEFORE_REFLECTION, beforeReflection))
        await delay(1000)
        const afterReflection: ResearchEvent = {
          event: EVENT_NAMES.AFTER_REFLECTION,
          data: { isSatisfactory: true },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.AFTER_REFLECTION, afterReflection))
        await delay(100)
        const endData: Record<string, any> = {
          company_name: 'NVIDIA Corporation',
          verified_company: true,
          company_summary: 'NVIDIA Corporation, founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem, is a leading technology company headquartered in Santa Clara, California. The company primarily designs and develops GPUs, chipsets, high-performance computing solutions, and multimedia software. With over 29,600 employees and annual revenue of $96.31 billion (2025), NVIDIA has established itself as a dominant force in the GPU market, particularly for AI applications. The company ranks #65 on the Fortune 500 (2024) and has become increasingly central to the AI and computing industry through its innovative hardware and software solutions.',
          key_executives: [
            {
              name: 'Jensen Huang',
              title: 'Founder, President & CEO',
              verification_date: '2025',
              confidence_level: 'high',
              source: 'Company records and public profiles',
            },
            {
              name: 'Colette Kress',
              title: 'EVP and CFO',
              verification_date: '2025',
              confidence_level: 'high',
              source: 'Company records',
            },
            {
              name: 'Jay Puri',
              title: 'Executive Vice President',
              verification_date: '2025',
              confidence_level: 'high',
              source: 'Company records',
            },
            {
              name: 'Tim Teter',
              title: 'EVP, General Counsel, and Secretary',
              verification_date: '2025',
              confidence_level: 'high',
              source: 'Company records',
            },
            {
              name: 'Michael Kagan',
              title: 'CTO',
              verification_date: '2025',
              confidence_level: 'high',
              source: 'Company records',
            },
            {
              name: 'Deepak Rao',
              title: 'CIO',
              verification_date: '2025',
              confidence_level: 'high',
              source: 'Company records',
            },
          ],
          main_products: [
            {
              name: 'GeForce RTX 50 Series',
              description: 'Latest GPU series featuring 92 billion transistors, providing 3,352 trillion AI operations per second, with up to 2x performance increase over RTX 4090',
              launch_date: '2025',
              current_status: 'Active',
            },
            {
              name: 'GeForce GPUs',
              description: 'Gaming-focused graphics processing units',
              launch_date: 'Ongoing',
              current_status: 'Active',
            },
            {
              name: 'Quadro GPUs',
              description: 'Professional Visualization graphics processing units',
              launch_date: 'Ongoing',
              current_status: 'Active',
            },
            {
              name: 'GRID',
              description: 'Graphics Virtualization platform',
              launch_date: 'Ongoing',
              current_status: 'Active',
            },
            {
              name: 'Data Center GPUs and CPUs',
              description: 'Hardware solutions for data centers and enterprise computing',
              launch_date: 'Ongoing',
              current_status: 'Active',
            },
          ],
          recent_developments: [
            {
              date: '2025',
              title: 'Launch of Blackwell architecture with RTX 50 Series',
              summary: 'Released next-generation GPU architecture with significant performance improvements',
              significance: 'Major product launch advancing GPU capabilities',
            },
            {
              date: '2024-2025',
              title: 'Introduction of DLSS 4 technology',
              summary: 'New AI-powered upscaling technology offering up to 8x performance boost',
              significance: 'Significant advancement in gaming and graphics technology',
            },
            {
              date: '2024-2025',
              title: 'Development of RTX Neural Shaders and Neural Faces technology',
              summary: 'New AI-powered graphics technologies',
              significance: 'Innovation in AI-driven graphics processing',
            },
            {
              date: '2024-2025',
              title: 'Expansion into AI and generative AI capabilities for PCs',
              summary: 'Broadening AI technology offerings for personal computing',
              significance: 'Strategic expansion into growing AI market',
            },
          ],
          historical_challenges: [
            {
              issue_type: 'Legal/Regulatory',
              description: 'Antitrust probe from US Justice Department',
              date_period: '2024',
              current_status: 'Ongoing',
              resolution: 'Pending',
            },
            {
              issue_type: 'Regulatory',
              description: 'Investigation by China\'s market regulators',
              date_period: '2024-2025',
              current_status: 'Ongoing',
              resolution: 'Pending',
            },
            {
              issue_type: 'Regulatory',
              description: 'Potential $1.03 billion fine in China related to Mellanox acquisition compliance',
              date_period: '2024-2025',
              current_status: 'Pending',
              resolution: 'Unresolved',
            },
            {
              issue_type: 'Trade Restrictions',
              description: 'Navigating US-China trade restrictions affecting GPU exports',
              date_period: '2024-2025',
              current_status: 'Ongoing',
              resolution: 'Adapting to restrictions',
            },
          ],
          leadership_caveats: 'Some subsidiary leadership positions and complete organizational structure details are not fully documented.',
          org_chart_summary: 'The company operates under the leadership of founder and CEO Jensen Huang, with key executive positions including CFO, CTO, CIO, General Counsel, and various Executive Vice Presidents. Detailed organizational structure below these positions is not fully documented.',
          sources: [
            {
              url: 'nvidia.com',
              title: 'NVIDIA Corporate Website',
              date_accessed: '2025',
              information_type: [
                'company overview',
                'leadership',
                'products',
              ],
            },
            {
              url: 'sec.gov',
              title: 'SEC Filings',
              date_accessed: '2025',
              information_type: [
                'financial information',
                'executive leadership',
                'corporate governance',
              ],
            },
          ],
          distinguishing_features: 'Leading GPU manufacturer and AI computing company, known for GeForce gaming products and data center solutions. Distinguished by its dominant position in AI chip market and innovative graphics technologies.',
        }
        const end: ResearchEvent = {
          event: EVENT_NAMES.END,
          data: { info: endData },
          timestamp: timestamp(),
        }
        controller.enqueue(encode(EVENT_NAMES.END, end))
        controller.close()
      },
    })
  })
})
