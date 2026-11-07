const TRANSLATIONS: Record<string, string> = {
  'invalid password': 'Incorrect password.',
  'URL not found or expired': 'This link does not exist or has expired.',
  'invalid manage token': 'Invalid management token.',
  'slug is taken and no alternative could be found':
    'This custom slug is already taken and no alternative was available.',
  'slug must be 5-50 characters: letters, numbers, or hyphens':
    'The slug must be 5-50 characters (letters, numbers, and hyphens only).',
  'invalid ttl value': 'Invalid expiration TTL value.',
  'failed to create URL': 'Failed to shorten URL. Please try again.',
  'failed to check slug': 'Failed to verify slug availability.',
  'internal error': 'Internal server error. Please try again later.',
  'Too Many Requests': 'Too many requests. Please wait a moment and try again.',
}

export function translateError(message: string): string {
  if (message.startsWith('target_url:')) {
    return 'Target URL must be a valid http or https address.'
  }
  return TRANSLATIONS[message] ?? message
}
