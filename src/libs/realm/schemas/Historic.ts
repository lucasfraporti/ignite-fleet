import { Realm } from '@realm/react'

import { CoordsSchemaProps } from './Coords'

type GenerateProps = {
  user_id: string
  description: string
  license_plate: string
  coords: CoordsSchemaProps[]
}

// Deve-se utilizar o mesmo nome da coleção no Realm
export class Historic extends Realm.Object<Historic> {
  _id!: string
  user_id!: string
  license_plate!: string
  description!: string
  coords!: CoordsSchemaProps[]
  status!: string
  created_at!: Date
  updated_at!: Date

  // Informando os campos que serão utilizados
  static generate({
    user_id,
    description,
    license_plate,
    coords,
  }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      license_plate,
      coords,
      status: 'departure',
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

  // Como será no banco de dados
  static schema = {
    // Nome da coleção no Realm
    name: 'Historic',
    // Chave primária
    primaryKey: '_id',

    properties: {
      _id: 'uuid',
      user_id: {
        type: 'string',
        // Informando que o campo será utilizado como filtro em pesquisas (campo indexado)
        indexed: true,
      },
      license_plate: 'string',
      description: 'string',
      coords: {
        type: 'list',
        objectType: 'Coords',
      },
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  }
}
