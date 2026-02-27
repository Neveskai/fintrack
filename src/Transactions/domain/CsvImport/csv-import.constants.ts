import { Category, CategoryEnum } from '@/Transactions/common/enums'

export type Rule = {
  category: CategoryEnum
  keywords: string[]
}

export const rules: Rule[] = [
  {
    category: Category.ALIMENTACAO,
    keywords: [
      'ifd*', // prefixo: compras no app iFood → alimentação
      'supermercado', 'mercado', 'atacad', 'assai', 'carne', 'rocha carnes',
      'casa da carne', 'açougue', 'padaria', 'mercatto', 'jfcondimentos',
      'condimento', 'queijo', 'frutas', 'amendoim', 'vieira', 'armazem',
      'feira', 'hortifruti', 'aliment', 'restaurante', 'organico',
      'ita sucos', 'pastelli', 'sorvete', 'barista', 'cafe'
    ]
  },
  {
    category: Category.TRANSPORTE,
    keywords: [
      'uber', '99 ride', 'dl*99', 'pg *99', '99pop', 'combustível',
      'posto', 'estacionamento', 'pedagio'
    ]
  },
  {
    category: Category.MORADIA,
    keywords: [
      'energisa', 'igua', 'agua', 'esgoto', 'condominio', 'aluguel',
      'iptu', 'secretaria municipal', 'chama gas', 'gas'
    ]
  },
  {
    category: Category.EDUCACAO,
    keywords: [
      'educbank', 'educacional', 'escola', 'manaim', 'faculdade',
      'universidade', 'curso'
    ]
  },
  {
    category: Category.SAUDE,
    keywords: [
      'farmacia', 'drogaria', 'drogamais', 'farma', 'plenapharma',
      'raia', 'droga', 'hospital', 'medic', 'clinica', 'formula exata'
    ]
  },
  {
    category: Category.ASSINATURAS,
    keywords: [
      'netflix', 'amazon prime', 'youtube', 'cursor ai', 'crunchyroll',
      'spotify', 'disney', 'hbo', 'claro pgto', 'fortnet', 'ifood club',
      'recarga de celular'
    ]
  },
  {
    category: Category.INVESTIMENTO,
    keywords: [
      'resgate rdb', 'aplicação rdb', 'investimento', 'rendimento',
      'cdb', 'tesouro'
    ]
  },
  {
    category: Category.TRANSFERENCIA,
    keywords: [
      'transferência enviada', 'transferência recebida', 'pix',
      'pagamento de fatura', 'pagamento de boleto', 'pagamento recebido'
    ]
  },
  {
    category: Category.COMPRAS,
    keywords: [
      'amazon', 'americanas', 'mercadolivre', 'mercadopago', 'shopee',
      'lojas', 'ferreiracostacom', 'shopping', 'magazin', 'cacau show',
      'lojab2cstore'
    ]
  },
  {
    category: Category.LAZER,
    keywords: [
      'clash royale', 'google clash', 'game', 'jogo', 'cinema',
      'teatro', 'show', 'turne', 'evento', 'ingresso'
    ]
  }
]