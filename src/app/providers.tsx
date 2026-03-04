'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init('phc_TRUBZuisiPWSHgh5HoZfTZr2AwJZ9NMf9jeVgeQ1yTi', {
    api_host: 'https://ph.aisb.dev',
    person_profiles: 'always',
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
