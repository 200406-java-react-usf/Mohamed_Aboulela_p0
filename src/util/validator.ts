export const isValidId = (id: number): boolean => {
    return (id && typeof id === 'number' && Number.isInteger(id) && id > 0);
}

export function isEmptyObject<T>(obj: T) {
    return obj && Object.keys(obj).length === 0;
}

export const isValidStrings = (...strs: string[]): boolean => {
   
    for (let str of strs) {
        if (!str || typeof str !== 'string') {
            return false;
        }
    }

    return true;

}

export const isValidObject = (obj: Object, ...nullableProps: string[]) => {
    
    return obj && Object.keys(obj).every(key => {
        if (nullableProps.includes(key)) return true;
        return obj[key];
    });

}

export const isPropertyOf = (prop: string, type: any) => {

    if (!prop || !type) {
        return false;
    }

    let typeCreator = <T>(Type: (new () => T)): T => {
        return new Type();
    } 

    let tempInstance;
    try {
        tempInstance = typeCreator(type);
    } catch {
        return false;
    }
    
    return Object.keys(tempInstance).includes(prop);

}

export default {
    isValidId,
    isValidStrings,
    isValidObject,
    isPropertyOf
}