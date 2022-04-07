export type DtoFieldTransformer<T = any> = (value: T) => T
export type DtoFieldReg = { [field: string]: DtoFieldTransformer }

const DOT_INCLUDES: { [key: string]: DtoFieldReg } = {}

export function Dto(transformer: DtoFieldTransformer = (v) => v) {
    return (target: any, field: string) => {
        const key = target.constructor.name
        if (DOT_INCLUDES[key]) {
            if (typeof (DOT_INCLUDES[key][field]) !== 'undefined') {
                DOT_INCLUDES[key][field] = transformer
            } else {
                DOT_INCLUDES[key] = {
                    ...DOT_INCLUDES[key] || {},
                    [field]: transformer
                }
            }
        } else {
            DOT_INCLUDES[key] = {
                [field]: transformer
            }
        }

    }
}

export function toDto<T>(target: T) {
    const key = target.constructor.name
    const dto: any = { ...target }
    for (let f in dto) {
        console.log(key, f, target[f], DOT_INCLUDES[key][f])
        if (DOT_INCLUDES[key] && DOT_INCLUDES[key][f]) {
            dto[f] = DOT_INCLUDES[key][f](target[f])
        }
    }
    return dto
}
