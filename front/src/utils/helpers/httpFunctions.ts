const URLBack = import.meta.env.VITE_URLBack;

export const GETFunction = async (endpoint: string) => {
    try {
        const response = await fetch(`${URLBack}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = response.json()

        console.log('INIT_-_-_-_-_-_-_-_-_-')
        console.log(endpoint)
        console.log(responseJson)
        console.log('FIN_-_-_-_-_-_-_-_-_-')

        return await responseJson;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const POSTFunction = async (endpoint: string, data: any) => {
    try {
        const response = await fetch(`${URLBack}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseJson = response.json()

        console.log('INIT_-_-_-_-_-_-_-_-_-')
        console.log(endpoint)
        console.log(responseJson)
        console.log('FIN_-_-_-_-_-_-_-_-_-')

        return await responseJson;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const PUTFunction = async (endpoint: string, data: any) => {
    try {
        const response = await fetch(`${URLBack}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseJson = response.json()

        console.log('INIT_-_-_-_-_-_-_-_-_-')
        console.log(endpoint)
        console.log(responseJson)
        console.log('FIN_-_-_-_-_-_-_-_-_-')

        return await responseJson;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const DELETEFunction = async (endpoint: string, data: any) => {
    try {
        const response = await fetch(`${URLBack}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = response.json()

        console.log('INIT_-_-_-_-_-_-_-_-_-')
        console.log(endpoint)
        console.log(responseJson)
        console.log('FIN_-_-_-_-_-_-_-_-_-')

        return await responseJson;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};