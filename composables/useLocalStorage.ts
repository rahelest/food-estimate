export function useLocalStorage() {
    return {
        load(field: string) {
            try {
                const storage = localStorage.getItem(field);
                return JSON.parse(storage || '');
            } catch (err) {
                return undefined;
            }
        },

        save(field: string, value: any) {
            try {
                localStorage.setItem(field, JSON.stringify(value));
            } catch (err) {
                //shrug
            }
        }
    }
}
