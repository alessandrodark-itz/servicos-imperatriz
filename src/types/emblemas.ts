export interface Emblema {
  id: string
  slug: string
  titulo: string
  descricao: string
  icone: string
  cor: string
  cor_fundo: string
  ativo: boolean
}

export interface PrestadorEmblema {
  id: string
  prestador_id: string
  emblema_id: string
  ordem: number
  emblema: Emblema
}
