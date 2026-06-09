'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init('phc_TRUBZuisiPWSHgh5HoZfTZr2AwJZ9NMf9jeVgeQ1yTi', {
    api_host: 'https://ph.aisb.dev',
    person_profiles: 'always',
    // Cookieless: keep the visitor id in memory only, so no cookies or
    // localStorage are used for analytics and no consent banner is required.
    persistence: 'memory',
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
