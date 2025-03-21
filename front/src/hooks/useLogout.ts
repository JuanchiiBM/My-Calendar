const useLogout = () => {
    const logout = () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userName')
        window.location.href = '/'
    }
    
    return {logout}
}

export default useLogout
