import { parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs'

const withPush = { history: 'push' } as const

export const arrayStringParser = parseAsArrayOf(parseAsString)
  .withOptions(withPush)

export const stringParser = parseAsString
  .withOptions(withPush)

export const integerParser = parseAsInteger
  .withOptions(withPush)