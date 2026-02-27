import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Input,
  Text,
  IconButton,
  Table,
  Flex
} from '@/common/ui'
import { BsPlus, BsPencil, BsTrash, BsCheck, BsX, BsImage } from 'react-icons/bs'
import type { Transaction } from '@/Transactions/domain/Transaction'
import type { TransactionItemDTO } from '@/Transactions/common/services/TransactionItems'
import { TransactionItemService } from '@/Transactions/common/services/TransactionItems'
import { QueryKeys } from '@/Transactions/common/constants/query-keys'
import { ocrService } from '@/common/services/OCR'
import { InputValue } from '../../InputValue'

type Props = {
  transaction: Transaction
}

const formatAmount = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

export const TransactionItemsSection = ({ transaction }: Props) => {
  const queryClient = useQueryClient()
  const queryKey = [QueryKeys.TRANSACTION_ITEMS, transaction.id]

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => TransactionItemService.getByTransactionId(transaction.id),
    enabled: !!transaction.id
  })

  const createMutation = useMutation({
    mutationFn: (payload: { description: string; quantity: number; amount: number }) =>
      TransactionItemService.create(transaction.id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  const updateMutation = useMutation({
    mutationFn: ({
      itemId,
      payload
    }: {
      itemId: string
      payload: { description?: string; quantity?: number; amount?: number }
    }) => TransactionItemService.update(transaction.id, itemId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) =>
      TransactionItemService.delete(transaction.id, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey })
  })

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    amount: '0.00'
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    description: string
    quantity: number
    amount: string
  }>({ description: '', quantity: 1, amount: '0.00' })
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const desc = newItem.description.trim()
    if (!desc) return
    const amount = parseFloat(newItem.amount) || 0
    if (amount <= 0) return
    createMutation.mutate(
      {
        description: desc,
        quantity: Math.max(1, Math.round(newItem.quantity)),
        amount
      },
      {
        onSuccess: () =>
          setNewItem({ description: '', quantity: 1, amount: '0.00' })
      }
    )
  }

  const startEdit = (item: TransactionItemDTO) => {
    setEditingId(item.id)
    setEditForm({
      description: item.description,
      quantity: item.quantity,
      amount: item.amount.toFixed(2)
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = () => {
    if (!editingId) return
    const desc = editForm.description.trim()
    if (!desc) return
    updateMutation.mutate(
      {
        itemId: editingId,
        payload: {
          description: desc,
          quantity: Math.max(1, Math.round(editForm.quantity)),
          amount: parseFloat(editForm.amount) || 0
        }
      },
      { onSuccess: () => setEditingId(null) }
    )
  }

  const totalItems = items.reduce((sum, i) => sum + i.amount, 0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) {
      setOcrError('Selecione uma imagem (PNG, JPG, etc.).')
      return
    }
    setOcrError(null)
    setOcrLoading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64Data = result.includes(',') ? result.split(',')[1] : result
          resolve(base64Data ?? '')
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
      const mimeType = file.type || 'image/jpeg'
      const parsed = await ocrService.parseReceiptItems(base64, mimeType)
      if (!parsed || parsed.length === 0) {
        setOcrError('Nenhum item encontrado na imagem. Tente outra foto ou adicione manualmente.')
        return
      }
      await TransactionItemService.createMany(transaction.id, parsed)
      queryClient.invalidateQueries({ queryKey })
    } catch (err) {
      console.error('OCR or create failed:', err)
      setOcrError(
        err instanceof Error ? err.message : 'Erro ao ler a imagem. Tente novamente.'
      )
    } finally {
      setOcrLoading(false)
    }
  }

  return (
    <Box
      borderTopWidth="1px"
      borderColor="border"
      pt={4}
      mt={4}
    >
      <Flex justify="space-between" align="center" mb={4} gap={2} flexWrap="wrap">
        <Heading size="sm" fontWeight="600">
          Itens da compra
        </Heading>
        <HStack gap={2}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={ocrLoading}
          >
            <BsImage /> {ocrLoading ? 'Analisando...' : 'Ler cupom/nota'}
          </Button>
        </HStack>
      </Flex>
      {ocrError && (
        <Text fontSize="sm" color="red.500" mb={2}>
          {ocrError}
        </Text>
      )}

      {isLoading ? (
        <Text fontSize="sm" color="gray.500" py={2}>
          Carregando itens...
        </Text>
      ) : (
        <>
          {items.length === 0 ? (
            <Text fontSize="sm" color="gray.500" mb={4}>
              Nenhum item cadastrado. Use o formulário abaixo para adicionar.
            </Text>
          ) : (
            <Box
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
              overflow="hidden"
              mb={4}
            >
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader w="40%">Descrição</Table.ColumnHeader>
                    <Table.ColumnHeader w="12%" textAlign="center">
                      Qtd
                    </Table.ColumnHeader>
                    <Table.ColumnHeader w="28%" textAlign="right">
                      Valor
                    </Table.ColumnHeader>
                    <Table.ColumnHeader w="20%" textAlign="right">
                      Ações
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {items.map(item => (
                    <Table.Row key={item.id}>
                      {editingId === item.id ? (
                        <>
                          <Table.Cell colSpan={4} py={2}>
                            <Grid
                              templateColumns="1fr 72px 120px auto"
                              gap={2}
                              alignItems="end"
                            >
                              <Input
                                size="sm"
                                placeholder="Descrição"
                                value={editForm.description}
                                onChange={e =>
                                  setEditForm(f => ({ ...f, description: e.target.value }))
                                }
                              />
                              <Input
                                size="sm"
                                type="number"
                                min={1}
                                placeholder="Qtd"
                                value={editForm.quantity}
                                onChange={e =>
                                  setEditForm(f => ({
                                    ...f,
                                    quantity: parseInt(e.target.value, 10) || 1
                                  }))
                                }
                              />
                              <InputValue
                                value={editForm.amount}
                                onChange={val =>
                                  setEditForm(f => ({ ...f, amount: val }))
                                }
                              />
                              <HStack gap={1} justify="flex-end">
                                <IconButton
                                  size="sm"
                                  aria-label="Salvar"
                                  onClick={saveEdit}
                                  disabled={updateMutation.isPending}
                                >
                                  <BsCheck />
                                </IconButton>
                                <IconButton
                                  size="sm"
                                  variant="outline"
                                  aria-label="Cancelar"
                                  onClick={cancelEdit}
                                >
                                  <BsX />
                                </IconButton>
                              </HStack>
                            </Grid>
                          </Table.Cell>
                        </>
                      ) : (
                        <>
                          <Table.Cell>
                            <Text fontSize="sm">
                              {item.description}
                            </Text>
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            <Text fontSize="sm" color="gray.600">
                              {item.quantity}
                            </Text>
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            <Text fontSize="sm" fontWeight="500">
                              {formatAmount(item.amount)}
                            </Text>
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            <HStack gap={0} justify="flex-end">
                              <IconButton
                                size="xs"
                                variant="ghost"
                                aria-label="Editar"
                                onClick={() => startEdit(item)}
                              >
                                <BsPencil />
                              </IconButton>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                colorPalette="red"
                                aria-label="Excluir"
                                onClick={() => deleteMutation.mutate(item.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <BsTrash />
                              </IconButton>
                            </HStack>
                          </Table.Cell>
                        </>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}

          {items.length > 0 && (
            <Flex justify="flex-end" mb={4}>
              <Text fontSize="sm" fontWeight="600">
                Total dos itens: {formatAmount(totalItems)}
              </Text>
            </Flex>
          )}

          <Box
            p={3}
            borderWidth="1px"
            borderColor="border"
            borderRadius="sm"
            bg="bg.subtle"
          >
            <Text fontSize="sm" fontWeight="600" mb={2}>
              Adicionar item
            </Text>
            <Grid
              templateColumns={{ base: '1fr', sm: '1fr 72px 120px auto' }}
              gap={3}
              alignItems="end"
            >
              <Box>
                <Text fontSize="xs" mb={1} color="gray.600">
                  Descrição
                </Text>
                <Input
                  size="sm"
                  placeholder="Ex.: Arroz 5kg"
                  value={newItem.description}
                  onChange={e =>
                    setNewItem(f => ({ ...f, description: e.target.value }))
                  }
                />
              </Box>
              <Box>
                <Text fontSize="xs" mb={1} color="gray.600">
                  Qtd
                </Text>
                <Input
                  size="sm"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={newItem.quantity}
                  onChange={e =>
                    setNewItem(f => ({
                      ...f,
                      quantity: parseInt(e.target.value, 10) || 1
                    }))
                  }
                />
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.600">
                  Valor
                </Text>
                <InputValue
                  label=""
                  value={newItem.amount}
                  onChange={val =>
                    setNewItem(f => ({ ...f, amount: val }))
                  }
                />
              </Box>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={
                  !newItem.description.trim() ||
                  (parseFloat(newItem.amount) || 0) <= 0 ||
                  createMutation.isPending
                }
              >
                <BsPlus /> Adicionar
              </Button>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  )
}
