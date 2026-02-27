import { Page, Button, HStack, Box, Text } from '@/common/ui'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import {
  TransactionService,
  CounterpartyService,
  toImportKey
} from '@/Transactions/common/services'
import { useUserSettings } from '@/common/hooks'
import { useTheme } from 'next-themes'
import { CsvImport } from '@/Transactions/domain/CsvImport'
import { categorizeByDescription } from '@/Transactions/domain/CsvImport/csv-import.helpers'

export const ImportPage = () => {
  const navigate = useNavigate()
  const [csvImport, setCsvImport] = useState<CsvImport | null>(null)
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const { settings } = useUserSettings()
  const classificationRules = settings?.classificationRules
  const { resolvedTheme } = useTheme()
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.700'
  const bgRow = resolvedTheme === 'light' ? '#fbfcfd' : '#151519'

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      
      if (!file) return

      setFileName(file.name)
      setImportMessage(null)
      setError('')

      const reader = new FileReader()

      reader.onload = event => {
        const text = event.target?.result as string
        setCsvImport(new CsvImport(text))
      }

      reader.readAsText(file, 'utf-8')
    },
    []
  )

  const onImport = async () => {
    if (!csvImport) return

    setImporting(true)
    setError('')
    setImportMessage(null)

    try {
      const counterpartyMap = await CounterpartyService.getAllAsMap()

      const getCategory = (description: string) => {
        const key = CounterpartyService.normalizeName(description)
        const fromCounterparty = counterpartyMap.get(key)
        if (fromCounterparty !== undefined) return fromCounterparty
        return categorizeByDescription(description, classificationRules?.length ? classificationRules : undefined)
      }

      const payloads = csvImport.toPayloads(getCategory)
      if (payloads.length === 0) return

      const dates = csvImport.rows.map(r => r.date)
      const minDate = dates.reduce((a, b) => (a < b ? a : b))
      const maxDate = dates.reduce((a, b) => (a > b ? a : b))

      const existingKeys = await TransactionService.getExistingImportKeys(minDate, maxDate)
      const toCreate = payloads.filter(
        p => !existingKeys.has(toImportKey(p.date, p.description, p.amount, p.type))
      )
      const skippedCount = payloads.length - toCreate.length

      if (toCreate.length === 0) {
        setImportMessage('Todas as transações já existem.')
        return
      }

      await TransactionService.createMany(toCreate)

      if (skippedCount > 0) {
        setImportMessage(
          `${skippedCount} transações já existentes foram ignoradas. ${toCreate.length} novas importadas.`
        )
      } else {
        setImportMessage(`${toCreate.length} transações importadas.`)
      }
      navigate(TransactionRoutes.Transactions)
    } catch (err) {
      console.error('Import failed:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao importar transações.'
      )
    } finally {
      setImporting(false)
    }
  }

  const rows = csvImport?.rows ?? []

  return (
    <Page.Root maxWidth="1000px" gap={3.5}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: '/' },
          { label: 'Transações', href: TransactionRoutes.Transactions },
          { label: 'Importar CSV' }
        ]}
        title="Importar CSV"
        description="Importe transações a partir da fatura do cartão de crédito (CSV)"
        pb={4}
      />

      <Page.Body>
        <HStack
          gap={4}
          alignItems="flex-end"
          flexDirection={{ base: 'column', md: 'row' }}
          width="100%"
        >
          <Box w={{ base: '100%', md: 'auto' }} minW={0}>
            <Text fontSize={14} mb={1} fontWeight={500}>
              Arquivo CSV (fatura do cartão)
            </Text>
            <input
              type="file"
              accept=".csv"
              onChange={onFileChange}
              style={{ fontSize: '14px', width: '100%', maxWidth: '100%' }}
            />
          </Box>
        </HStack>

        {fileName && (
          <Text mt={2} fontSize={14} color="gray.500">
            {rows.length} transações encontradas em {fileName}
          </Text>
        )}

        {rows.length > 0 && (
          <Box
            mt={4}
            border="xs"
            borderColor={borderColor}
            borderRadius="xs"
            maxH="400px"
            overflowY="auto"
            width="100%"
            minW={0}
            className="scrollbar-thin"
          >
            <HStack
              px={{ base: 3, md: 4 }}
              py={2}
              fontSize={{ base: 12, md: 13 }}
              fontWeight={600}
              borderBottom="xs"
              borderColor={borderColor}
              bg={bgRow}
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Text minW={{ base: 70, md: 95 }}>Data</Text>
              <Text flex={1} minW={0} truncate>Descrição</Text>
              <Text minW={{ base: 80, md: 100 }} textAlign="right">
                Valor
              </Text>
            </HStack>

            {rows.map((row, i) => (
              <HStack
                key={i}
                px={{ base: 3, md: 4 }}
                py={1.5}
                fontSize={{ base: 12, md: 13 }}
                borderBottom="xs"
                borderColor={borderColor}
              >
                <Text minW={{ base: 70, md: 95 }}>{row.date}</Text>
                <Text flex={1} truncate minW={0}>
                  {row.description}
                </Text>
                <Text
                  minW={{ base: 80, md: 100 }}
                  textAlign="right"
                  color={row.amount < 0 ? 'red.500' : 'green.500'}
                  fontWeight={500}
                >
                  {row.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </Text>
              </HStack>
            ))}
          </Box>
        )}

        {error && (
          <Text mt={3} fontSize={14} color="red.500" fontWeight={500}>
            {error}
          </Text>
        )}

        {importMessage && (
          <Text mt={3} fontSize={14} color="gray.600" _dark={{ color: 'gray.400' }} fontWeight={500}>
            {importMessage}
          </Text>
        )}

        {rows.length > 0 && (
          <Button
            mt={4}
            w={{ base: '100%', md: 'auto' }}
            colorPalette="blue"
            disabled={importing}
            onClick={onImport}
          >
            {importing ? 'Importando...' : `Importar ${rows.length} transações`}
          </Button>
        )}
      </Page.Body>
    </Page.Root>
  )
}
