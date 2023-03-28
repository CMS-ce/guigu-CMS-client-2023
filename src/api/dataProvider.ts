// in src/dataProvider.ts
import {
    DataProvider,
    RaRecord,
    UpdateParams,
    UpdateResult,
    fetchUtils,
} from 'react-admin'
import { stringify } from 'query-string'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const apiUrl = 'http://localhost:8000'

// const httpClient = fetchUtils.fetchJson
const fetchOptions: fetchUtils.Options = {
    user: {
        authenticated: true,
        token: `Bearer ${
            localStorage.getItem('jwt_token') as string | undefined
        }`,
    },
}
const httpClient = async (url = '', options = {}) => {
    const { status, headers, body, json } = await fetchUtils.fetchJson(url, {
        ...options,
        ...fetchOptions,
    })
    // console.log('fetchJson result', { status, headers, body, json })
    return { status, headers, body, json }
}

// TypeScript users must reference the type `DataProvider`
export const dataProvider: DataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`

        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json.data,
                total: json.total,
            }
        })
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        const url = `${apiUrl}/${resource}/ids?${stringify(query)}`
        return httpClient(url).then(({ json }) => ({ data: json }))
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        }
        const url = `${apiUrl}/${resource}?${stringify(query)}`

        return httpClient(url).then(({ headers, json }) => ({
            data: json.data,
            total: json.total,
        }))
    },

    update: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },

    create: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: json,
        }))
    },

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        }
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }))
    },
}

interface MyDataProvider<ResourceType extends string = string>
    extends DataProvider {
    updateStatus: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: UpdateParams
    ) => Promise<UpdateResult<RecordType>>
}

export const myDataProvider: MyDataProvider = {
    ...dataProvider,
    create: (resource, params) => {
        if (resource !== 'products') {
            return dataProvider.create(resource, params)
        }

        const newPictures = params.data.pictures.filter(
            (p: any) => p.rawFile instanceof File
        )
        const formerPictures = params.data.pictures.filter(
            (p: any) => !(p.rawFile instanceof File)
        )

        return Promise.all(newPictures.map(convertFileToBase64))
            .then((base64Pictures) =>
                base64Pictures.map((picture64) => ({
                    src: picture64,
                    title: uuidv4(),
                }))
            )
            .then((transformedNewPictures) =>
                dataProvider.create(resource, {
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                })
            )
    },
    update: (resource, params) => {
        if (resource !== 'products') {
            return dataProvider.update(resource, params)
        }

        const newPictures = params.data.pictures.filter(
            (p: any) => p.rawFile instanceof File
        )
        const formerPictures = params.data.pictures.filter(
            (p: any) => !(p.rawFile instanceof File)
        )

        return Promise.all(newPictures.map(convertFileToBase64))
            .then((base64Pictures) =>
                base64Pictures.map((picture64) => ({
                    src: picture64,
                    title: uuidv4(),
                }))
            )
            .then((transformedNewPictures) =>
                dataProvider.update(resource, {
                    id: params.id,
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                    previousData: {},
                })
            )
    },

    updateStatus: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }))
    },
}

const convertFileToBase64 = (file: any) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject

        reader.readAsDataURL(file.rawFile)
    })
