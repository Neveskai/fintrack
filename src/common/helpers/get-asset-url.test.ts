import { getAssetUrl } from './get-asset-url'

describe('getAssetUrl', () => {
  it('returns local path when VITE_PLATFORM is dev', () => {
    expect(getAssetUrl('/assets/foo.svg', { VITE_PLATFORM: 'dev' })).toBe(
      '/assets/foo.svg'
    )
    expect(getAssetUrl('bar.png', { VITE_PLATFORM: 'dev' })).toBe('bar.png')
  })

  it('returns bucket URL with encoded path when not dev', () => {
    const url = getAssetUrl('/assets/foo bar.svg', {
      VITE_PLATFORM: 'prod',
      VITE_PUBLIC_BUCKET_URL: 'https://bucket/',
    })
    expect(url).toBe(
      'https://bucket/foo%20bar.svg?alt=media'
    )
  })

  it('strips leading /assets/ or assets/ from path', () => {
    const base = 'https://b/'
    expect(getAssetUrl('/assets/x.png', { VITE_PUBLIC_BUCKET_URL: base })).toBe(
      'https://b/x.png?alt=media'
    )
    expect(getAssetUrl('assets/x.png', { VITE_PUBLIC_BUCKET_URL: base })).toBe(
      'https://b/x.png?alt=media'
    )
  })
})
