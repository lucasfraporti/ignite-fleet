import { Realm } from '@realm/react'

import { ObjectSchema } from 'realm'

type GenerateProps = {
  user_id: string
  description: string
  license_plate: string
}

// Deve-se utilizar o mesmo nome da coleção no Realm
export class Historic extends Realm.Object<Historic> {
  _id!: string
  user_id!: string
  license_plate!: string
  description!: string
  status!: string
  created_at!: Date
  updated_at!: Date

  // Informando os campos que serão utilizados
  static generate({ user_id, description, license_plate }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      license_plate,
      status: 'departure',
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

  // Como será no banco de dados
  static schema: ObjectSchema = {
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
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  }
}
