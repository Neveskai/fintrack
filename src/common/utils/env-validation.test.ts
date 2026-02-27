import { validateEnv } from './env-validation'

describe('validateEnv', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

  afterEach(() => {
    warnSpy.mockClear()
    infoSpy.mockClear()
  })

  afterAll(() => {
    warnSpy.mockRestore()
    infoSpy.mockRestore()
  })

  it('does nothing when PROD is true', () => {
    validateEnv({ PROD: true })
    expect(warnSpy).not.toHaveBeenCalled()
    expect(infoSpy).not.toHaveBeenCalled()
  })

  it('warns when required vars are missing', () => {
    validateEnv({ PROD: false })
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Variáveis obrigatórias não configuradas')
    )
    expect(warnSpy.mock.calls[0][0]).toContain('VITE_FIREBASE_API_KEY')
  })

  it('does not warn when required vars are provided', () => {
    validateEnv({
      PROD: false,
      VITE_FIREBASE_API_KEY: 'k',
      VITE_FIREBASE_AUTH_DOMAIN: 'd',
      VITE_FIREBASE_PROJECT_ID: 'p',
      VITE_FIREBASE_APP_ID: 'a',
    })
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('info when optional vars are missing', () => {
    validateEnv({
      PROD: false,
      VITE_FIREBASE_API_KEY: 'k',
      VITE_FIREBASE_AUTH_DOMAIN: 'd',
      VITE_FIREBASE_PROJECT_ID: 'p',
      VITE_FIREBASE_APP_ID: 'a',
    })
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Variáveis opcionais não configuradas')
    )
  })
})
