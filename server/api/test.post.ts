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
          company_name: 'Apple Inc.',
          founding_year: 1976,
          founder_names: [
            'Steve Jobs',
            'Steve Wozniak',
            'Ronald Wayne',
          ],
          product_description: 'Apple designs, manufactures, and sells a wide range of consumer electronics and software products including iPhone, iPad, Mac computers, Apple Watch, and Apple TV, along with services like iOS, macOS, iCloud, App Store, Apple Music, and Apple TV+. The company is known for its design aesthetic, attention to detail, and tight integration between hardware and software.',
          funding_summary: 'Initially funded by Steve Jobs selling his VW minibus ($1,500) and Steve Wozniak selling his HP calculator ($500). The company went public on December 12, 1980, raising $101.2M in its IPO. Apple later became the first US public company to reach valuations of $1 trillion (2018), $2 trillion (2020), and $3 trillion (2022).',
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
